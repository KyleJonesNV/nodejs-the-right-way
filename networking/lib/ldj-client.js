const EventEmitter = require('events').EventEmitter

class LDJClient extends EventEmitter {
    constructor(stream) {
        super()
        let buffer = ""
        stream.on("data", (data) => {
            buffer += data

            let boundary = buffer.indexOf('\n')

            while(boundary !== -1) {
                const input = buffer.slice(0, boundary + 1)
                buffer = buffer.slice(boundary + 1)
    
                this.emit("message", JSON.parse(input))
                boundary = buffer.indexOf('\n')
            }
        })
    }

    static connect(stream) {
        return new LDJClient(stream)
    }
}

module.exports = LDJClient