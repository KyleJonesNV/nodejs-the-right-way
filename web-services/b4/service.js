'use strict'

const express = require('express')
const morgan = require('morgan')
const nconf = require('nconf')
const pkg = require('./package.json')

// 1) load argument variables.
// eg: node server.js --es:host=some.other.host
// 2) Then load environment variables.
// eg: es__host=some.other.host node server.js
nconf.argv().env('__')
// Load the config file,
// which can be overwritten by setting 'conf' in previous step.
nconf.defaults({
    conf: `${__dirname}/config.json`
})
nconf.file(nconf.get('conf'))

const app = express()

app.use(morgan('dev'))

app.get('/api/version', (req, res) => {
    res.status(200).send(pkg.version)
})

require('./lib/search.js')(app, nconf.get('es'))
require('./lib/bundle.js')(app, nconf.get('es'))

app.listen(nconf.get('port'), () => {
    console.log(`Ready and listening on port ${nconf.get('port')}`)
})
