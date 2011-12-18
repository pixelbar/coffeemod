irc = require('irc')
{Log}   = require('./log')
express = require('express')
mysql = require('mysql')
sanitizer = require('sanitizer')


class Adapters
  @init: ->
    new Adapters()
  
  IRC: (opts) ->
    options = opts || {}
    
    Log.debug "Connecting to IRC as #{options.nickname}"
    bot = new irc.Client('irc.quakenet.org', options.nickname, {
      channels: ['#illuzion']
    })
    
    bot.addListener 'message', (nick, channel, text) =>
      msg = sanitizer.sanitize(text)
      if msg.match(/coffeebot/i)
        bot.say("#illuzion", 'Capucinno, espresso? Gimme some coffee!')
      else if msg.match(/(hoeveel koffie|liter koffie|liters koffie|totaal aantal koffie|aantal liter koffie|hoeveelheid koffie)/i)
        @db.query 'SELECT sum(`stathoeveelheid`) AS liter FROM '+@table+' WHERE `statproduct` = "koffie"', (err, results) ->
          Log.error err if err?
          bot.say("#illuzion", 'Er is in totaal '+results[0].liter/10+' liter koffie gezet!') if results.length > 0
      else if msg.match(/(hoeveel thee|liter thee|liters thee|totaal aantal thee|aantal liter thee|hoeveelheid thee)/i)
        @db.query 'SELECT sum(`stathoeveelheid`) AS liter FROM '+@table+' WHERE `statproduct` = "thee"', (err, results) ->
          Log.error err if err?
          bot.say("#illuzion", 'Er is in totaal '+results[0].liter/10+' liter thee gezet!') if results.length > 0
      else if msg.match(/(hoeveel warm water|liter warm water|liters warm water|totaal aantal warm water|aantal liter warm water|hoeveelheid warm water)/i)
        @db.query 'SELECT sum(`stathoeveelheid`) AS liter FROM '+@table+' WHERE `statproduct` = "warm water"', (err, results) ->
          Log.error err if err?
          bot.say("#illuzion", 'Er is in totaal '+results[0].liter/10+' liter warm water gezet!') if results.length > 0
      else if msg.match(/(hoeveel afwas water|liter afwas water|liters afwas water|totaal aantal afwas water|aantal liter afwas water|hoeveelheid afwas water)/i)
        @db.query 'SELECT sum(`stathoeveelheid`) AS liter FROM '+@table+' WHERE `statproduct` = "warm water"', (err, results) ->
          Log.error err if err?
          bot.say("#illuzion", 'Er is in totaal '+results[0].liter/10+' liter afwas water gezet!') if results.length > 0
      else if msg.match(/(make me some coffee)/i)
         bot.say("#illuzion", 'I only make coffee for my master boemlauw! So go make it yourself...')
          
    return bot
    
  web: (opts) ->
    options = opts || {}
    
    bot = options.irc
    app = express.createServer()
    @db = mysql.createClient
      user: options.config.user
      password: options.config.pass
      host: options.config.host
      database: options.config.database
    
    @table = options.config.table
    
    app.get '/make/:sort/:liters', (req, res) =>
      liters = (req.params.liters)/10
      
      switch req.params.sort
        when "koffie"
          bot.say "#illuzion", "Er wordt nu "+liters+" liter koffie gezet"
          @db.query 'INSERT INTO '+@table+' (`stathoeveelheid`, `statproduct`) VALUES("'+req.params.liters+'", "koffie")'
        when "thee"
          bot.say "#illuzion", "Er wordt nu "+liters+" liter thee gezet"
          @db.query 'INSERT INTO '+@table+' (`stathoeveelheid`, `statproduct`) VALUES("'+req.params.liters+'", "thee")'
        when "warm"
          bot.say "#illuzion", "Er wordt nu "+liters+" liter heet water gezet"
          @db.query 'INSERT INTO '+@table+' (`stathoeveelheid`, `statproduct`) VALUES("'+req.params.liters+'", "warm water")'
        when "afwas"
          bot.say "#illuzion", "Er wordt nu "+liters+" liter warm water voor de afwas gezet"
          @db.query 'INSERT INTO '+@table+' (`stathoeveelheid`, `statproduct`) VALUES("'+req.params.liters+'", "afwas water")'
        
      Log.debug "Receiving data -- soort: #{req.params.sort} - hoeveel: #{req.params.liters}"
      res.end()
      
    app.listen(80)
    
exports.Adapters = Adapters