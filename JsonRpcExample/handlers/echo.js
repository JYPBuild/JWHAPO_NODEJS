var echo = function(params, callback){
  console.log('JSON-RPC echo 호출됨.');
  console.log('PARAMS -> ' + JSON.stringify(params));
  console.dir(params);
  callback(null, params);
};

module.exports = echo;
