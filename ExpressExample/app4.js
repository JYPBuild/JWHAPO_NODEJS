
var express = require('express');
var http = require('http');

// express  객체생성
var app = express();

app.use(function(req, res, next){
  console.log('첫 번째 미들웨어에서 요청을 처리함.');
  //json 형태 return 
  res.send({name:'소녀시대', age:20});
});
http.createServer(app).listen(3000,function(){
  console.log('Express  서버가 300번 포트에서 시작됨.');
});
