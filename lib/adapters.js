(function() {
  var Adapters, Log, express, irc;

  irc = require('irc');

  Log = require('./log').Log;

  express = require('express');

  Adapters = (function() {

    function Adapters() {
      this.bot = {};
    }

    Adapters.IRC = function(opts) {
      var options;
      options = opts || {};
      Log.debug("Connecting to IRC as " + options.nickname);
      return this.bot = new irc.Client('irc.quakenet.org', options.nickname, {
        channels: ['#illuzion']
      });
    };

    Adapters.web = function() {
      var app;
      app = express.createServer();
      app.get('/make/:sort/:liters', function(req, res) {
        Log.debug("Receiving data: soort " + req.params.sort + " - hoeveel: " + req.params.liters);
        return res.end();
      });
      return app.listen(80);
    };

    return Adapters;

  })();

  exports.Adapters = Adapters;

}).call(this);
