irc = require('irc')
{Log}   = require('./log')
express = require('express')

class Adapters
  @IRC: (opts) ->
    options = opts || {}
    
    Log.debug "Connecting to IRC as #{options.nickname}"
    bot = new irc.Client('irc.quakenet.org', options.nickname, {
      channels: ['#illuzion']
    })
    
    return bot
    
  @web: (opts) ->
    options = opts || {}
    
    bot = options.irc
    app = express.createServer()
    
    app.get '/make/:sort/:liters', (req, res) ->
      switch req.params.sort
        when "koffie"
          bot.say "#illuzion", "Made coffee (#{req.params.liters} liter)"
        when "thee"
          bot.say "#illuzion", "Made tea (#{req.params.liters} liter)"
        when "warm"
          bot.say "#illuzion", "Made hot water (#{req.params.liters} liter)"
        when "afwas"
          bot.say "#illuzion", "Made water for the dishes (#{req.params.liters} liter)"
        
      Log.debug "Receiving data -- soort: #{req.params.sort} - hoeveel: #{req.params.liters}"
      res.end()
      
    app.listen(80)
    
exports.Adapters = Adapters