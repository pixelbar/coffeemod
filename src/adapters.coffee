irc = require('irc')
{Log}   = require('./log')
express = require('express')

class Adapters
  constructor: ->
    @bot = {}
    
  @IRC: (opts) ->
    options = opts || {}
    
    Log.debug "Connecting to IRC as #{options.nickname}"
    @bot = new irc.Client('irc.quakenet.org', options.nickname, {
      channels: ['#illuzion']
    })
    
  @web: ->
    app = express.createServer()
      
    app.get '/make/:sort/:liters', (req, res) ->
      #Log.debug "Hit the server!"
      Log.debug "Receiving data -- soort: #{req.params.sort} - hoeveel: #{req.params.liters}"
      res.end()
      
    app.listen(80)
    
exports.Adapters = Adapters