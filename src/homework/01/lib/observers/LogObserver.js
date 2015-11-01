/* global __dirname, module, require */

var Observer = require('./Observer'),
  fs = require('fs');

function LogObserver(config) {
  'use strict';
  this.config = config;
  this.config.path = this.config.path || __dirname;
  if (!fs.existsSync(this.config.path)) {
    // living on the edge here
    // race condition, yada yada
    fs.mkdirSync(this.config.path);
  }
}

LogObserver.prototype = Object.create(Observer.prototype);

LogObserver.prototype.update = function (title, data) {
  'use strict';
  var filename = Date.now() + ".txt",
    today = new Date(),
    content = today.toString() + " " + title + " " + data,
    fullPath = this.config.path + "/" + filename;
  fs.writeFileSync(fullPath, content);
  console.log("Log file written");
};

module.exports = LogObserver;

