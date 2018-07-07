/**
http 모듈에서 POST 방식으로 값 받아오는 방법
*/
var http = require('http');

var options = {
  host: 'www.google.com',
  port: 80,
  method: 'POST',
  path: '/',
  headers: {}
}

var resData = '';

/**
  POST 방식으로 요청할 경우에는 request() 메소드를 사용한다.
  GET 방식과는 다르게 요청보낼경우 요청 헤더와 본문을 모두 직접 설정해야한다.

*/
var req = http.request(options, function(res){
  res.on('data', function(chunk){
    resData += chunk;
  });

  res.on('end',function(){
    console.log(resData);
  });

  options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  req.data = "q=actor";
  options.headers['Content-Length'] = req.data.length;

  req.on('error', function(err){
    console.log("오류발생 : "+err.message);
  });

  req.write(req.data);
  req.end();
})
