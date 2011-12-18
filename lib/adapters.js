(function() {
  var Adapters, Log, express, irc, mysql;

  irc = require('irc');

  Log = require('./log').Log;

  express = require('express');

  mysql = require('mysql');

  Adapters = (function() {

    function Adapters() {}

    Adapters.init = function() {
      return new Adapters();
    };

    Adapters.prototype.IRC = function(opts) {
      var bot, options;
      options = opts || {};
      Log.debug("Connecting to IRC as " + options.nickname);
      bot = new irc.Client('irc.quakenet.org', options.nickname, {
        channels: ['#illuzion']
      });
      return bot;
    };

    Adapters.prototype.web = function(opts) {
      var app, bot, db, options, table;
      options = opts || {};
      bot = options.irc;
      app = express.createServer();
      db = mysql.createClient({
        user: options.config.user,
        password: options.config.pass,
        host: options.config.host,
        database: options.config.database
      });
      table = options.config.table;
      app.get('/make/:sort/:liters', function(req, res) {
        var liters;
        liters = req.params.liters / 10;
        switch (req.params.sort) {
          case "koffie":
            bot.say("#illuzion", "Made coffee (" + liters + " liter)");
            db.query('INSERT INTO ' + table + ' (`stathoeveelheid`, `statproduct`) VALUES("' + req.params.liters + '", "koffie")');
            break;
          case "thee":
            bot.say("#illuzion", "Made tea (" + liters + " liter)");
            db.query('INSERT INTO ' + table + ' (`stathoeveelheid`, `statproduct`) VALUES("' + req.params.liters + '", "thee")');
            break;
          case "warm":
            bot.say("#illuzion", "Made hot water (" + liters + " liter)");
            db.query('INSERT INTO ' + table + ' (`stathoeveelheid`, `statproduct`) VALUES("' + req.params.liters + '", "warm water")');
            break;
          case "afwas":
            bot.say("#illuzion", "Made water for the dishes (" + liters + " liter)");
            db.query('INSERT INTO ' + table + ' (`stathoeveelheid`, `statproduct`) VALUES("' + req.params.liters + '", "afwas water")');
        }
        Log.debug("Receiving data -- soort: " + req.params.sort + " - hoeveel: " + req.params.liters);
        return res.end();
      });
      return app.listen(80);
    };

    return Adapters;

  })();

  exports.Adapters = Adapters;

}).call(this);
