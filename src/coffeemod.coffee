cli = require('cli').enable('version')
daemon = require('daemon')
{Log}   = require('./log')

adapters = require('./adapters').Adapters
Config = require('./config').Config

class CoffeeMod
  @run: ->
    args = cli.parse({
      config: ["c", "Path to the config file", "path", "./config.json"]
      daemon: ["d", "Run CoffeeMod as a daemon"]
      log:    ["l", "Log debugging commands to file", "path", "./log/debug.log"]
      irc:    ["n", "Set a nickname for the IRC bot", "nickname", "CoffeeBot"]
    }, ["start", "stop", "restart"])
    
    new CoffeeMod(args, cli.command)

  constructor: (args, command) ->
    # Load the config
    @config = Config.parse(args.config)
    process.exit(1) if not @config?
      
    if args.daemon?
      console.log "DAEMON!"
    else
      @start(args)
      
  start: (opts) ->
    @options = opts || {}
    adapters.IRC(nickname: @options.irc)
    adapters.web()
    
exports.CoffeeMod = CoffeeMod