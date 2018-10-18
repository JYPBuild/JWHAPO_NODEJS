var handler_loader = {};

var handler_info = require('.handler_info');
var utils = require('jayson/lib/utils');

handler_loader.init = function(jayson,app,api_path){
  initHandler(jayson, app, api_path);
};

function initHandler(jayson, app, api_path){
  var handlers = {};

}

module.exports = handler_loader;
