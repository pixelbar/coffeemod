(function() {
  var DB, Log, sqlite;

  sqlite = require('sqlite3');

  Log = require('./log').Log;

  DB = (function() {

    DB.create = ["CREATE TABLE coffeestats (      `id` INTEGER PRIMARY KEY AUTOINCREMENT,      `statshoeveelheid` INTEGER NOT NULL,	  `statproduct` VARCHAR(120) NOT NULL    );"];

    function DB(folder) {
      this.dbfile = "" + folder + "/.coffeemod/coffeemod.db";
      this.db = new sqlite.Database();
    }

    DB.prototype.use = function(cb) {
      return this.db.open(this.dbfile, function(err) {
        if (err) {
          return Log.error(err);
        } else {
          return cb();
        }
      });
    };

    DB.prototype.query = function(sql, cb) {
      var _this = this;
      return this.use(function() {
        return _this.db.execute(sql, function(err, rows) {
          if (err != null) Log.error(err);
          if (cb != null) return cb(rows);
        });
      });
    };

    DB.prototype.setup = function(done) {
      var _this = this;
      return this.use(function() {
        var finished, query, _i, _len, _ref, _results;
        finished = 0;
        _ref = DB.create;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          query = _ref[_i];
          _results.push(_this.db.execute(query, function(err, rows) {
            if (err != null) Log.error(err);
            finished++;
            if (finished === DB.create.length) return done();
          }));
        }
        return _results;
      });
    };

    return DB;

  })();

  exports.DB = DB;

}).call(this);
