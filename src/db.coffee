sqlite  = require('sqlite3')
{Log}   = require('./log')

class DB
  # Table creation queries
  @create = [
    "CREATE TABLE coffeestats (
      `id` INTEGER PRIMARY KEY AUTOINCREMENT,
      `statshoeveelheid` INTEGER NOT NULL,
	  `statproduct` VARCHAR(120) NOT NULL
    );"
  ]
  
  constructor: (folder) ->
    @dbfile = "#{folder}/.coffeemod/coffeemod.db"
    @db = new sqlite.Database()

  use: (cb) ->
    @db.open @dbfile, (err) ->
      if err then Log.error err else cb()
      
  query: (sql, cb) ->
    @use => @db.execute sql, (err, rows) ->
      Log.error err if err?
      cb(rows) if cb?
      
  setup: (done) ->
    @use =>
      finished = 0
      for query in DB.create
        @db.execute query, (err, rows) ->
          Log.error err if err?
          finished++
          
          done() if finished == DB.create.length
          
exports.DB = DB