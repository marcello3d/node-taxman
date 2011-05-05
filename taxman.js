/* taxman by Marcello Bastea-Forte - zlib license */
var EventEmitter = require('events').EventEmitter

module.exports = function(factory) {
    var cachedValue, cached, emitter
    function cacher(callback) {
        if (cached) {
            callback(null, cachedValue)
        } else if (emitter) {
            emitter.once('done',callback)
        } else {
            emitter = new EventEmitter
            factory(function(error, value) {
                if (!error) {
                    cachedValue = value
                    cached = true
                }
                callback(error, value)
                emitter.emit('done', error, value)
                emitter = null
            })
        }
    }
    cacher.reset = function() {
        cached = false
        if (emitter) {
            emitter.removeAllListeners('done')
            emitter = null
        }
    }
    return cacher
}