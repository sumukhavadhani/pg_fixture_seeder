var recursive = require('recursive-readdir');
var path = require('path');
var async = require('async');
var Sequelize = require('sequelize');

var models = {};
var dbMap = {};

exports.init = function(model_base_path, cb) {
  recursive(model_base_path, function (err, files) {
    async.eachSeries(files, function(file, callback) {
      var model_name = path.basename(file, path.extname(file));      
      models[model_name] = file;
      callback(null);
    }, function(err) {
      cb()
    });
  });
}

var getDatabaseObject = function(dbname, host, port, user, password, cb) {
  if(dbMap && dbMap[dbname]) {
    cb(dbMap[dbname]);
  } else {
    var db = new Sequelize(dbname, user, password, {
      host: host,
      dialect: 'postgres',
      pool: { max: 1, min: 0, idle: 10000 },
      define: {
        timestamps: true,
        underscored: true
      },
      logging: false
    });
    dbMap[dbname] = db;
    cb(db);
  }
}

exports.seed = function(fixturePath, host, port, user, password, done) {
  recursive(fixturePath, function (err, files) {    
    async.eachSeries(files, function(file, callback) {
      file = path.join(path.dirname(file), path.basename(file, path.extname(file)));
      var fixture = require(file);
      getDatabaseObject(fixture.database, host, port, user, password, function(db) {  
        var f = models[fixture.model];   
        f = path.join(path.dirname(f), path.basename(f, path.extname(f)));
        console.log(f);
        var model = db.import(f);
        var count = 0;
        console.log('Deleting data from model:', fixture.model);
        var query = "DELETE FROM " + fixture.model + " ;";
        dbMap[fixture.database].query(query).spread(function(r, m){      
          console.log('Resetting sequence for model:', fixture.model);
          query = "ALTER SEQUENCE " + fixture.model + "_id_seq" + " RESTART WITH 1 ;";
          dbMap[fixture.database].query(query).spread(function(r, m){
            async.eachSeries(fixture.fixtures, function(data, cb) {
              model.create(data).then(function(result) {
                count = count + 1;                
                cb(null);
              });
            }, function(err) {
              console.log('Seeded ' + count + ' fixture into ' + fixture.model);
              callback(err);
            });  
          });  
        });
      });      
    }, function(err) {
      done(err);
    });
  })
};
