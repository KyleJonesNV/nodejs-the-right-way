/**
 * Provides API endpoints for searching the books index
 */

'use strict'

const request = require('request')

require('dotenv').config()

module.exports = (app, es) => {
  const url = `https://${es.host}:${es.port}/${es.books_index}/_search`

  /**
   * Search for books by matching a particular field value.
   * Example: /api/search/books/author/Twain
   */
  app.get('/api/search/books/:field/:query', (req, res) => {
    const esReqBody = {
      size: 10,
      query: {
        match: {
          [req.params.field]: req.params.query,
        },
      },
    }

    const options = {
      url,
      json: true,
      body: esReqBody,
      auth: {
        user: process.env.ELASTIC_USER,
        pass: process.env.ELASTIC_PASS,
      },
    }

    request.get(options, (err, esRes, esResBody) => {
      if (err) {
        res.status(502).json({
          error: 'bad_gateway',
          reason: err.code,
        })
        return
      }

      if (esRes.statusCode !== 200) {
        res.status(esRes.statusCode).json(esResBody)
        return
      }

      res.status(200).json(esResBody.hits.hits.map(({ _source }) => _source))
    })
  })

  /**
   * Collect suggested terms for a given field based on a given query
   */
  app.get('/api/suggest/books/:field/:query', (req, res) => {
    const url = `https://${es.host}:${es.port}/${es.books_index}/_search`

    const esReqBody = {
      size: 0,
      suggest: {
        suggestions: {
          text: req.params.query,
          term: {
            field: req.params.field,
            suggest_mode: 'always',
          },
        },
      },
    }

    const options = {
      url,
      json: true,
      body: esReqBody,
      auth: {
        user: process.env.ELASTIC_USER,
        pass: process.env.ELASTIC_PASS,
      },
    }

    const promise = new Promise((resolve, reject) => {
      request.get(options, (err, esRes, esResBody) => {
        if (err) {
          reject({ error: err })
          return
        }

        if (esRes.statusCode !== 200) {
          reject({ error: esResBody })
          return
        }

        resolve(esResBody)
      })
    })

    promise
      .then((esResBody) => {
        res.status(200).json(esResBody)
      })
      .catch(({error}) => {
        res.status(error.status || 502).json(error)
      })
  })
}