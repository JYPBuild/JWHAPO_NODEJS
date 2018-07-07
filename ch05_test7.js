var http = require('http');

var options = {
  host: 'www.google.com',
  port: 80,
  path: '/'
};
/**
    http 객체의 get() 메소드
    첫 번째 파라미터는 연결할 사이트의 정보를 담고 있으며, 두 번째 파라미터는 콜백 함수다.
    응답 데이터를 받을 때는 data 이벤트와 end 이벤트로 처리
    data이벤트에서 받은 데이터를 처리하고 end 이벤트에서 수신이 완료되면 처리할 일을 한다.
*/
var req = http.get(options, function(res){
  //응답처리
  var resData = '';
  res.on('data',function(chunk){
    resData += chunk;
  });

  res.on('end', function(){
    console.log(resData);
  });
});

req.on('error', function(err){
  console.log("오류발생 : "+ err.message);
})
