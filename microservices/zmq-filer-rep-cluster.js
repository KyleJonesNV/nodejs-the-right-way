'use strict'

const cluster = require('cluster')
const fs = require('fs')
const zmq = require('zeromq')

const numWorkers = require('os').cpus().length

// Primary process creates router and dealer sockets and binds endpoints.
if (cluster.isPrimary) {
  const router = zmq.socket('router').bind('tcp://127.0.0.1:60401')
  const dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc')

  // Forward messages between the router and the dealer
  router.on('message', (...frames) => {
    dealer.send(frames)
  })
  dealer.on('message', (...frames) => {
    router.send(frames)
  })

  // Listen for workers to come online
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`)
  })

  // Listen for workers exiting / killed
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} has exited`)
    console.log('Forking a new worker...')
    cluster.fork()
  })

  // Fork a worker process for each CPU.
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork()
  }
} else {
  // Worker processes createa REP socket and connect to the dealer
  const responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc')

  // Handle incoming requests.
  responder.on('message', (data) => {
    // Parse the incoming message.
    const request = JSON.parse(data)
    console.log(`Received request to get: ${request.path}`)

    // Read the file and reply with content
    fs.readFile(request.path, (err, content) => {
      console.log(`${process.pid} sending response content`)
      responder.send(
        JSON.stringify({
          content: content.toString(),
          timestamp: Date.now(),
          pid: process.pid,
        }),
      )
    })
  })
}
