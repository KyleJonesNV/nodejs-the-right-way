'use strict'

const netClient = require('net').connect({port: 60301})
const ldjClient = require('./lib/ldj-client.js').connect(netClient)

ldjClient.on('message', (message) => {
    console.log("message", message)
    
    if (message.type === 'watching') {
        console.log(`Now watching: ${message.file}`)
        return
    }
    if (message.type === 'changed') {
        const date = new Date(message.timestamp)
        console.log(`File changed: ${date}`)
        return
    }

    console.log(`Unrecognised message type: ${message.type}`)
})