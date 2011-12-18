(function() {
  var CoffeeMod, Config, DB, Log, adapters, cli, daemon;

  cli = require('cli').enable('version');

  daemon = require('daemon');

  Log = require('./log').Log;

  DB = require('./db').DB;

  adapters = require('./adapters').Adapters.init();

  Config = require('./config').Config;

  CoffeeMod = (function() {

    CoffeeMod.run = function() {
      var args;
      args = cli.parse({
        config: ["c", "Path to the config file", "path", "./config.json"],
        daemon: ["d", "Run CoffeeMod as a daemon"],
        log: ["l", "Log debugging commands to file", "path", "./log/debug.log"],
        irc: ["n", "Set a nickname for the IRC bot", "nickname", "CoffeeBot"]
      }, ["start", "stop", "restart"]);
      return new CoffeeMod(args, cli.command);
    };

    function CoffeeMod(args, command) {
      this.config = Config.parse(args.config);
      if (!(this.config != null)) process.exit(1);
      if (args.daemon != null) {
        console.log("DAEMON!");
      } else {
        this.start(args);
      }
    }

    CoffeeMod.prototype.start = function(opts) {
      var bot;
      this.options = opts || {};
      bot = adapters.IRC({
        nickname: this.options.irc
      });
      return adapters.web({
        irc: bot,
        config: this.config
      });
    };

    return CoffeeMod;

  })();

  exports.CoffeeMod = CoffeeMod;

}).call(this);
