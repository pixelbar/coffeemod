irc = require('irc')
{Log}   = require('./log')

class Adapters
  @IRC: (opts) ->
    options = opts || {}
    
    Log.debug "Connceting to IRC as #{options.nickname}"
    bot = new irc.Client('irc.quakenet.org', options.nickname, {
      channels: ['#illuzion']
    })
    
exports.Adapters = Adapters
