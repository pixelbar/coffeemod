(function() {
  var IRC;

  IRC = (function() {
    var bot;

    function IRC() {}

    bot = new irc.Client('irc.quakenet.org', IRC.options.nick, {
      channels: ['#illuzion']
    });

    return IRC;

  })();

}).call(this);
