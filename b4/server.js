'use strict'

const path = require('path')
const pkg = require('./package.json')
const {URL} = require('url')

// nconf configuration
const nconf = require('nconf')
nconf.argv().env('__').defaults({ NODE_ENV: 'development' })

const NODE_ENV = nconf.get('NODE_ENV')
const isDev = NODE_ENV === 'development'

nconf.argv().defaults({ conf: path.join(__dirname, `${NODE_ENV}.config.json`) })
nconf.file(nconf.get('conf'))

const serviceUrl = new URL(nconf.get('serviceUrl'))
const servicePort = serviceUrl.port || (serviceUrl.protocol === 'https' ? 443 : 80)

// Express and middleware
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))

app.get('/api/version', (req, res) => {
  res.status(200).send(pkg.version)
})

if (isDev) {
    const webpack = require('webpack')
    const webpackMiddleware = require('webpack-dev-middleware')
    const webpackConfig = require('./webpack.config.js')
    app.use(webpackMiddleware(webpack(webpackConfig), {
        publicPath: '/',
        stats: {colors: true}
    }))
} else {
    app.use(express.static('dist'))
}

app.listen(servicePort, () => {
  console.log(`Ready and listening on port ${servicePort}`)
})
