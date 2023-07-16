'use strict'

const net = require('net')

const server = net.createServer((connection) => {
    console.log('Subscriber connected.')

    // Two message chunks which together make a whole message
    const firstChunk = '{"type": "changed", "timesta'
    const secondChunk = 'mp": 1689515428225}\n'

    connection.write(firstChunk)

    const timeout = setTimeout(() => {
        connection.write(secondChunk)
        connection.end()
    }, 100)

    connection.on('end', () => {
        clearTimeout(timeout)
        console.log('Subscriber disconnected.')
    })
})

server.listen(60301, function() {
    console.log('Test server listening for subscribers...')
})