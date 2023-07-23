/**
 * Provide API for working with bundles.
 */

'use strict'

const fetch = require('node-fetch')
const querystring = require('querystring')

module.exports = (app, es) => {
  const url = `https://${es.host}:${es.port}/${es.bundles_index}/_doc`

  const user_password = process.env.ELASTIC_USER + ':' + process.env.ELASTIC_PASS
  const auth = btoa(user_password)

  /**
   * Create a new bundle with the specified name
   * curl -X POST https://<host>:<port>/api/bundle?name=<name>
   */
  app.post('/api/bundle', async (req, res) => {
    const bundle = {
      name: req.query.name || '',
      books: [],
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(bundle),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      })

      const data = await response.json()
      res.status(201).json(data)
    } catch (error) {
      res.status(502).json(error)
    }
  })

  /**
   * Retrieve a given bundle.
   */
  app.get('/api/bundle/:id', async (req, res) => {
    const bundleIDUrl = `${url}/${req.params.id}`

    try {
      const response = await fetch(bundleIDUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      })

      const data = await response.json()
      res.status(200).json(data)
    } catch (error) {
      res.status(502).json(error)
    }
  })

  /**
   * Set a given bundle name.
   * curl -s -X PUT https://<host>:<port>/api/bundle/<id>/name/<name>
   */
  app.put('/api/bundle/:id/name/:name', async (req, res) => {
    const bundleIDUrl = `${url}/${req.params.id}`

    try {
      // Get bundle by id
      const bundleResponse = await fetch(bundleIDUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      })

      const bundleData = await bundleResponse.json()

      // Set bundle name
      const bundle = bundleData._source
      bundle.name = req.params.name

      // Update bundle
      const bundleUpdateResponse = await fetch(bundleIDUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(bundle),
      })

      const data = await bundleUpdateResponse.json()

      res.status(200).json(data)
    } catch (error) {
      res.status(502).json(error)
    }
  })

  /**
   * Put a book into a bundle by its id.
   * curl -X PUT https://<host>:<port>/api/bundle/<id>/book/<pgid>
   */
  app.put('/api/bundle/:id/book/:pgid', async (req, res) => {
    const bundleIDUrl = `${url}/${req.params.id}`
    const bookUrl = `https://${es.host}:${es.port}/${es.books_index}/_doc/${req.params.pgid}`

    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      }

      const bundlePromise = fetch(bundleIDUrl, options).then((res) => res.json())
      const bookPromise = fetch(bookUrl, options).then((res) => res.json())

      const [bundleRes, bookRes] = await Promise.all([bundlePromise, bookPromise])
      const { _source: bundle, _seq_no: _seq_no, _primary_term: _primary_term } = bundleRes
      const { _source: book } = bookRes

      const idx = bundle.books.findIndex((book) => book.id === req.params.pgid)

      if (idx === -1) {
        bundle.books.push({
          id: book.id,
          title: book.title,
        })
      }

      // Put the updated bundle back in the index using es concurrency control
      const bundleUpdateResponse = await fetch(bundleIDUrl + `?${querystring.stringify({ if_seq_no: _seq_no, if_primary_term: _primary_term })}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(bundle),
      })

      const data = await bundleUpdateResponse.json()

      res.status(200).json(data)
    } catch (esResErr) {
      console.log(esResErr)
      res.status(esResErr.statusCode || 502).send(esResErr)
    }
  })
}
