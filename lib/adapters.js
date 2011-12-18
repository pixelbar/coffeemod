(function() {
  var Adapters, Log, express, irc;

  irc = require('irc');

  Log = require('./log').Log;

  express = require('express');

  Adapters = (function() {

    function Adapters() {}

    Adapters.IRC = function(opts) {
      var bot, options;
      options = opts || {};
      Log.debug("Connecting to IRC as " + options.nickname);
      bot = new irc.Client('irc.quakenet.org', options.nickname, {
        channels: ['#illuzion']
      });
      return bot;
    };

    Adapters.web = function(bot) {
      var app;
      app = express.createServer();
      app.get('/make/:sort/:liters', function(req, res) {
        switch (req.params.sort) {
          case "koffie":
            Log.debug("Made coffee");
            bot.say("#illuzion", "Made coffee");
            break;
          case "thee":
            Log.debug("Made tea");
            bot.say("#illuzion", "Made tea");
            break;
          case "warm":
            Log.debug("Made hot water");
            bot.say("#illuzion", "Made hot water");
            break;
          case "afwas":
            Log.debug("Made water for the dishes");
            bot.say("#illuzion", "Made water for the dishes");
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
