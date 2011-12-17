(function() {
  var Adapters, Log, irc;

  irc = require('irc');

  Log = require('./log').Log;

  Adapters = (function() {

    function Adapters() {}

    Adapters.IRC = function(opts) {
      var bot, options;
      options = opts || {};
      Log.debug("Connceting to IRC as " + options.nickname);
      return bot = new irc.Client('irc.quakenet.org', options.nickname, {
        channels: ['#illuzion']
      });
    };

    return Adapters;

  })();

  exports.Adapters = Adapters;

}).call(this);
