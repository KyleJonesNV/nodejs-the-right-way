/**
 * Provides API endpoints for searching the books index
 */

'use strict'

const request = require('request')

require('dotenv').config()

module.exports = (app, es) => {
    const url = `https://${es.host}:${es.port}/${es.books_index}/_search`

    console.log(url)

    /**
     * Search for books by matching a particular field value.
     * Example: /api/search/books/author/Twain
     */

    app.get('/api/search/books/:field/:query', (req, res) => {
        const esReqBody = {
            size: 10,
            query: {
                match: {
                    [req.params.field]: req.params.query
                }
            }
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
                    reason: err.code
                })
                return
            }

            if (esRes.statusCode !== 200) {
                res.status(esRes.statusCode).json(esResBody)
                return
            }

            res.status(200).json(esResBody.hits.hits.map(({_source}) => _source))
        })
    })
}