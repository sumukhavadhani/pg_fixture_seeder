var sequelizeAuto = require('sequelize-auto');
var fs = require('fs-extra');
var path = require('path');

exports.generate = function(database, modelsPath, username, password, host, port, cb) {  
  var configFile = {};
  configFile.dialect = 'postgres';
  configFile.port = port;
  configFile.host = host;
  configFile.logging = false;

  var dir = path.join(modelsPath, database);
  //fs.removeSync(dir);  
  fs.ensureDirSync(dir);
  var sa = new sequelizeAuto(database, username, password, configFile);
  sa.run({spaces: true, indentation: 2, directory: dir}, function(err){
    if (err) {
      cb(err);
    } else {
      cb(null);
    }
  });
}
