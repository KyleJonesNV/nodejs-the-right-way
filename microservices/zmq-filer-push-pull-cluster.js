'use struct'

const cluster = require('cluster')
const zmq = require('zeromq')
const fs = require('fs')

const filename = process.argv[2]

const numWorkers = require('os').cpus().length
const numJobs = 30

if (cluster.isPrimary) {
  const push = zmq.socket('push').bind('ipc://filer-push.ipc')
  const pull = zmq.socket('pull').bind('ipc://filer-pull.ipc')
  let readyWorkers = 0

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork()
  }

  let hasStartedJobs = false
  function sendJobs() {
    if (hasStartedJobs) {
      return
    }

    hasStartedJobs = true
    for (let i = 0; i < numJobs; i++) {
      push.send(
        JSON.stringify({
          path: filename,
        }),
      )
    }
  }

  pull.on('message', (data) => {
    const message = JSON.parse(data)

    if (message.type === 'ready') {
      console.log(`worker ${message.pid} is ready.`)
      readyWorkers++

      if (readyWorkers >= 3) {
        sendJobs()
      }
      return
    }

    if (message.type === 'result') {
      console.log(`Received following content from worker ${message.pid}\n${message.content}`)
    }
  })

  process.on('error', (err) => {
    console.error("Error:", err)
  })

  process.on('uncaughtException', (err) => {
    console.error("UncaughtException:", err)
  })
} else {
  const pull = zmq.socket('pull').connect('ipc://filer-push.ipc')
  const push = zmq.socket('push').connect('ipc://filer-pull.ipc')

  pull.on('message', (data) => {
    // Parse the incoming message.
    const request = JSON.parse(data)
    console.log(`Received request to get: ${request.path}`)

    // Read the file and reply with content
    fs.readFile(request.path, (err, content) => {
      console.log(`${process.pid} sending response content`)
      push.send(
        JSON.stringify({
          type: 'result',
          content: content.toString(),
          timestamp: Date.now(),
          pid: process.pid,
        }),
      )
    })
  })

  push.send(
    JSON.stringify({
      type: 'ready',
      pid: process.pid,
    }),
  )

  process.on('error', (err) => {
    console.error("Error:", err)
  })
}
