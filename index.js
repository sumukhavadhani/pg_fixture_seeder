var Seeder = require('./lib/fixture_seeder');
var Models = require('./lib/generate_models');
var fs = require('fs-extra');
var async = require('async');

var model_default_path = __dirname + '/models';

var models = function(databases, modelsPath, host, port, user, password, cb) {
  async.eachSeries(databases.split(','), function(database, callback) {
    try {
      stats = fs.lstatSync(path.join(m,database));
      if (stats.isDirectory()) {
        cb(null);
      }
    } catch (e) {
      fs.ensureDirSync(modelsPath)    
      Models.generate(database, modelsPath, user, password, host, port, callback);
    }
  }, function(err) {
    cb(err);
  });
}

exports.seed = function(fixturePath, databases, host, port, user, password, regenerate, modelsPath, cb) {
  var m = modelsPath || model_default_path;
  if(regenerate) {    
    models(databases, m, host, port, user, password, function(err){
      if(err) {
        console.log('Error while generating models');
        cb(err);
      } else {        
        Seeder.init(m, function(){    
          Seeder.seed(fixturePath, host, port, user, password, function(err) {
            cb(err);
          })
        });
      }
    });
  } else {
    Seeder.init(m, function(){    
      Seeder.seed(fixturePath, host, port, user, password, function(err) {
        cb(err);
      })
    });
  }
}