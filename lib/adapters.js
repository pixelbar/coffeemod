(function() {
  var Adapters, Log, express, irc, mysql, sanitizer;

  irc = require('irc');

  Log = require('./log').Log;

  express = require('express');

  mysql = require('mysql');

  sanitizer = require('sanitizer');

  Adapters = (function() {

    function Adapters() {}

    Adapters.init = function() {
      return new Adapters();
    };

    Adapters.prototype.IRC = function(opts) {
      var bot, options;
      var _this = this;
      options = opts || {};
      Log.debug("Connecting to IRC as " + options.nickname);
      bot = new irc.Client('irc.quakenet.org', options.nickname, {
        channels: ['#illuzion']
      });
      bot.addListener('message', function(nick, channel, text) {
        var msg;
        msg = sanitizer.sanitize(text);
        if (msg.match(/coffeebot/i)) {
          return bot.say("#illuzion", 'Capucinno, espresso? Gimme some coffee!');
        } else if (msg.match(/(hoeveel koffie|liter koffie|liters koffie|totaal aantal koffie|aantal liter koffie|hoeveelheid koffie)/i)) {
          return _this.db.query('SELECT sum(`stathoeveelheid`) AS liter FROM ' + _this.table + ' WHERE `statproduct` = "koffie"', function(err, results) {
            if (err != null) Log.error(err);
            if (results.length > 0) {
              return bot.say("#illuzion", 'Er is in totaal ' + results[0].liter / 10 + ' liter koffie gezet!');
            }
          });
        } else if (msg.match(/(hoeveel thee|liter thee|liters thee|totaal aantal thee|aantal liter thee|hoeveelheid thee)/i)) {
          return _this.db.query('SELECT sum(`stathoeveelheid`) AS liter FROM ' + _this.table + ' WHERE `statproduct` = "thee"', function(err, results) {
            if (err != null) Log.error(err);
            if (results.length > 0) {
              return bot.say("#illuzion", 'Er is in totaal ' + results[0].liter / 10 + ' liter thee gezet!');
            }
          });
        } else if (msg.match(/(hoeveel warm water|liter warm water|liters warm water|totaal aantal warm water|aantal liter warm water|hoeveelheid warm water)/i)) {
          return _this.db.query('SELECT sum(`stathoeveelheid`) AS liter FROM ' + _this.table + ' WHERE `statproduct` = "warm water"', function(err, results) {
            if (err != null) Log.error(err);
            if (results.length > 0) {
              return bot.say("#illuzion", 'Er is in totaal ' + results[0].liter / 10 + ' liter warm water gezet!');
            }
          });
        } else if (msg.match(/(hoeveel afwas water|liter afwas water|liters afwas water|totaal aantal afwas water|aantal liter afwas water|hoeveelheid afwas water)/i)) {
          return _this.db.query('SELECT sum(`stathoeveelheid`) AS liter FROM ' + _this.table + ' WHERE `statproduct` = "warm water"', function(err, results) {
            if (err != null) Log.error(err);
            if (results.length > 0) {
              return bot.say("#illuzion", 'Er is in totaal ' + results[0].liter / 10 + ' liter afwas water gezet!');
            }
          });
        } else if (msg.match(/(make me some coffee)/i)) {
          return bot.say("#illuzion", 'I only make coffee for my master boemlauw! So go make it yourself...');
        }
      });
      return bot;
    };

    Adapters.prototype.web = function(opts) {
      var app, bot, options;
      var _this = this;
      options = opts || {};
      bot = options.irc;
      app = express.createServer();
      this.db = mysql.createClient({
        user: options.config.user,
        password: options.config.pass,
        host: options.config.host,
        database: options.config.database
      });
      this.table = options.config.table;
      app.get('/make/:sort/:liters', function(req, res) {
        var liters;
        liters = req.params.liters / 10;
        switch (req.params.sort) {
          case "koffie":
            bot.say("#illuzion", "Er wordt nu " + liters + " liter koffie gezet");
            _this.db.query('INSERT INTO ' + _this.table + ' (`stathoeveelheid`, `statproduct`) VALUES("' + req.params.liters + '", "koffie")');
            break;
          case "thee":
            bot.say("#illuzion", "Er wordt nu " + liters + " liter thee gezet");
            _this.db.query('INSERT INTO ' + _this.table + ' (`stathoeveelheid`, `statproduct`) VALUES("' + req.params.liters + '", "thee")');
            break;
          case "warm":
            bot.say("#illuzion", "Er wordt nu " + liters + " liter heet water gezet");
            _this.db.query('INSERT INTO ' + _this.table + ' (`stathoeveelheid`, `statproduct`) VALUES("' + req.params.liters + '", "warm water")');
            break;
          case "afwas":
            bot.say("#illuzion", "Er wordt nu " + liters + " liter warm water voor de afwas gezet");
            _this.db.query('INSERT INTO ' + _this.table + ' (`stathoeveelheid`, `statproduct`) VALUES("' + req.params.liters + '", "afwas water")');
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
