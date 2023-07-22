/**
 * Provide API for working with bundles.
 */

'use strict'

const fetch = require('node-fetch')

module.exports = (app, es) => {
    const url = `https://${es.host}:${es.port}/${es.bundles_index}/_doc`

    /**
     * Create a new bundle with the specified name
     * curl -X POST https://<host>:<port>/api/bundle?name=<name>
     */
    app.post('/api/bundle', async (req, res) => {
        const user_password = process.env.ELASTIC_USER + ':' + process.env.ELASTIC_PASS
        const auth = btoa(user_password)

        const bundle = {
            name: req.query.name || '',
            books: []
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(bundle),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${auth}`,
                  },
            })

            const data = await response.json()
            res.status(201).json(data)
        } catch (error) {
            res.status(502).json(error)   
        }
        
    })
}