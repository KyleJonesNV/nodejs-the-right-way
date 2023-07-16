'use strict'

const zmq = require('zeromq')

// Create subscriber endpoint
const subsciber = zmq.socket('sub')

// Subscribe to all messages
subsciber.subscribe('')

// Handle messages from the publisher
subsciber.on('message', (data) => {
    const message = JSON.parse(data)
    const date = new Date(message.timestamp)
    console.log(`File ${message.file} changed at ${date}`)
})

// Connect to the publisher
subsciber.connect('tcp://localhost:60400')