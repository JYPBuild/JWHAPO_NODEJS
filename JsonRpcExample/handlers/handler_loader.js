
var handler_loader = {};

var handler_info = require('./handler_info');
var utils = require('jayson/lib/utils');

handler_loader.init = function(jayson, app, api_path) {
	console.log('handler_loader.init 실행함.');
	return initHandlers(jayson, app, api_path);
}

function initHandlers(jayson, app, api_path) {
	var handlers = {};

	var infoLen = handler_info.length;
	console.log(' : %d', infoLen);

	for (var i = 0; i < infoLen; i++) {
		var curItem = handler_info[i];

		var curHandler = require(curItem.file);
		console.log('%s .', curItem.file);

		handlers[curItem.method] = new jayson.Method({
			handler: curHandler,
			collect: true,
			params: Array
		});

		console.log('.', curItem.method);
	}

	var jaysonServer = jayson.server(handlers);



	app.post(api_path, function(req, res, next) {
	    console.log(' [' + api_path + '].');

	    var options = {};

		var contentType = req.headers['content-type'] || '';
		if(!RegExp('application/json', 'i').test(contentType)) {
			console.log('application/json .');
			return error(415);
		};

	    if(!req.body || typeof(req.body) !== 'object') {
	    	console.log('Request body must be parsed.');
	    	return error(400, 'Request body must be parsed');
	    }

	    console.log('RPC .');
	    jaysonServer.call(req.body, function(error, success) {
	      var response = error || success;

	      console.log(response);

	      utils.JSON.stringify(response, options, function(err, body) {
	        if(err) return err;

	        if(body) {
	        	var headers = {
	        			"Content-Length": Buffer.byteLength(body, 'utf-8'),
	        			"Content-Type": "application/json"
	        	};

	        	res.writeHead(200, headers);
	        	res.write(body);
	        } else {
	        	res.writeHead(204);
	        }

	        res.end();
	      });
	    });

	    function error(code, headers) {
	    	res.writeHead(code, headers || {});
	    	res.end();
	    }

	});

	return handlers;
}

module.exports = handler_loader;
