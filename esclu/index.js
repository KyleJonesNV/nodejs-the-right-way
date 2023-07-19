'use strict'

const fs = require('fs')
const request = require('request')
const program = require('commander')
const pkg = require('./package.json')

require('dotenv').config()

const fullUrl = (path = '') => {
  let url = `https://${program.host}:${program.port}/`
  if (program.index) {
    url += program.index + '/'
  }
  return url + path.replace(/^\/*/, '')
}

const handleResponse = (err, res, body) => {
  if (program.json) {
    console.log(JSON.stringify(err || body))
  } else {
    if (err) {
      throw err
    }
    console.log(body)
  }
}

program.version(pkg.version).description(pkg.description).usage('[options] <command> [...]').option('-o, --host <hostname>', 'hostname [localhost]', 'localhost').option('-p, --port <number>', 'port number [9200]', '9200').option('-j, --json', 'format output as JSON').option('-i, --index <name>', 'which index to use').option('-f, --filter <filter>', 'source filter for query results')

program
  .command('url [path]')
  .description('generate the url for the options and path (default is /)')
  .action((path = '/') => {
    console.log(fullUrl(path))
  })

program
  .command('get [path]')
  .description('perform an HTTP GET request for path (default is /)')
  .action((path = '/') => {
    const options = {
      url: fullUrl(path),
      json: program.json,
      auth: {
        user: process.env.ELASTIC_USER,
        pass: process.env.ELASTIC_PASS,
      },
    }

    request(options, handleResponse)
  })

program
  .command('create-index')
  .description('create an index')
  .action(() => {
    if (!program.index) {
      const msg = 'No index specified! Use --index <name>'
      if (!program.json) throw Error(msg)
      console.log(JSON.stringify({ error: msg }))
      return
    }

    const options = {
      url: fullUrl(),
      json: program.json,
      auth: {
        user: process.env.ELASTIC_USER,
        pass: process.env.ELASTIC_PASS,
      },
    }

    request.put(options, handleResponse)
  })

program
  .command('list-indices')
  .description('get a list of indices in this cluster')
  .alias('li')
  .action(() => {    
    const path = program.json ? '_all' : '_cat/indices?v'
    const options = {
      url: fullUrl(path),
      json: program.json,
      auth: {
        user: process.env.ELASTIC_USER,
        pass: process.env.ELASTIC_PASS,
      },
    }

    request(options, handleResponse)
  })

program
  .command('bulk <file>')
  .description('read and perform bulk operations from the specified file')
  .action((file) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        if (!program.json) throw err
        console.log(JSON.stringify(err))
        return
      }

      const options = {
        url: fullUrl('_bulk'),
        json: true,
        auth: {
          user: process.env.ELASTIC_USER,
          pass: process.env.ELASTIC_PASS,
        },
        headers: {
          'contect-length': stats.size,
          'content-type': 'application/json',
        },
      }

      const req = request.post(options)

      const stream = fs.createReadStream(file)

      // Read file stream and write stream to request
      // reader.pipe(writer)
      stream.pipe(req)

      // Read response and write to std output
      // reader.pipe(writer)
      req.pipe(process.stdout)
    })
  })

program
  .command('query [queries...]')
  .description('query data by applying filters')
  .alias('q')
  .action((queries = []) => {
    const options = {
      url: fullUrl('_search'),
      json: program.json,
      auth: {
        user: process.env.ELASTIC_USER,
        pass: process.env.ELASTIC_PASS,
      },
      qs: {},
    }

    if (queries && queries.length) {
      options.qs.q = queries.join(' ')
    }

    if (program.filter) {
      options.qs._source = program.filter
    }

    request(options, handleResponse)
  })

program.parse(process.argv)

if (!program.args.filter((arg) => typeof arg === 'object').length) {
  program.help()
}
