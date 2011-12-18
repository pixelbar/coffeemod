irc = require('irc')
{Log}   = require('./log')
express = require('express')
mysql = require('mysql')


class Adapters
  @init: ->
    new Adapters()
  
  IRC: (opts) ->
    options = opts || {}
    
    Log.debug "Connecting to IRC as #{options.nickname}"
    bot = new irc.Client('irc.quakenet.org', options.nickname, {
      channels: ['#illuzion']
    })
    
    return bot
    
  web: (opts) ->
    options = opts || {}
    
    bot = options.irc
    app = express.createServer()
    db = mysql.createClient
      user: options.config.user
      password: options.config.pass
      host: options.config.host
      database: options.config.database
    
    table = options.config.table
    
    app.get '/make/:sort/:liters', (req, res) ->
      liters = (req.params.liters)/10
      
      switch req.params.sort
        when "koffie"
          bot.say "#illuzion", "Made coffee ("+liters+" liter)"
          db.query 'INSERT INTO '+table+' (`stathoeveelheid`, `statproduct`) VALUES("'+req.params.liters+'", "koffie")'
        when "thee"
          bot.say "#illuzion", "Made tea ("+liters+" liter)"
          db.query 'INSERT INTO '+table+' (`stathoeveelheid`, `statproduct`) VALUES("'+req.params.liters+'", "thee")'
        when "warm"
          bot.say "#illuzion", "Made hot water ("+liters+" liter)"
          db.query 'INSERT INTO '+table+' (`stathoeveelheid`, `statproduct`) VALUES("'+req.params.liters+'", "warm water")'
        when "afwas"
          bot.say "#illuzion", "Made water for the dishes ("+liters+" liter)"
          db.query 'INSERT INTO '+table+' (`stathoeveelheid`, `statproduct`) VALUES("'+req.params.liters+'", "afwas water")'
        
      Log.debug "Receiving data -- soort: #{req.params.sort} - hoeveel: #{req.params.liters}"
      res.end()
      
    app.listen(80)
    
exports.Adapters = Adapters