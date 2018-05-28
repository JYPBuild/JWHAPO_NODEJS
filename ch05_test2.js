/*
* 간단한 웹 서버 만들기.
*/

// http 모듈을 사용하면 웹 서버 기능을 담당하는 서버 객체를 만들 수 있다.
var http = require('http');
var server = http.createServer(); //웹 서버 객체를 만듬.

//웹 서버를 시작하고 3000번 포트 설정
var port = 3000;
//host IP 지정
var host = '14.39.185.5';

/*
* 메소드 이름 : 설명
* listen(port,[hostname],[backlog],[callback]) : 서버를 실행하여 대기시킨다.
* close([callback]) : 서버종료
*/

//서버를 시작할 때 포트는 3000번으로 지정하여 해당 포트에서 클라이언트의 요청을 대기한다.
// host 지정, 해당 서버 최대 접속자 50000명
// 4 번째 파라미터는 콜백 함수로, 웹 서버가 시작되면 호출된다.
server.listen(port,host,50000, function(){
  console.log('웹 서버가 시작되었습니다. : %s:%d', host, port);
});


/*
*클라이언트가 웹 서버에 요청할 떄 발생하는 이벤트 처리하기.
* 이벤트 : 설명
* connection : 클라이언트가 접속하여 연결이 만들어질 때 발생하는 이벤트.
* request : 클라이언트가 욫어할 떄 발생하는 이벤트
* close : 서버를 종료할 떄 발생하는 이벤트
*/
//클라이언트 연결 이벤트 처리
server.on('connection', function(socket){
  var addr = socket.address();
  console.log('클라이언트가 접속했습니다.: %s, %d', addr.address, addr.port);
});

//클라이언트 요청 이벤트 처리
server.on('request',function(req,res){
  console.log('요청들어옴');
  /*
  * 메소드 : 설명
  * writeHead(statusCode,statusMessage,headers) : 응답을 보낼 헤더를 만듬
  * write(chunk,encoding,callback) : 응답 본문데이터를 만든다.
  * end(data,encoding,callback) : 클라이언트로 응답을 전송한다. 파라미터에 데이터가 들어있다면 데이터를 포함시켜 응답을 전송한다.
  */
  res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
  res.write("<!DOCTYPE html>                                ");
  res.write("<html>                                         ");
  res.write(" <head>                                        ");
  res.write("   <title>JYP Project 180529</title>           ");
  res.write(" </head>                                       ");
  res.write(" <body>                                        ");
  res.write("   <h1> JYP Project in DooJung City </h1>      ");
  res.write(" </body>                                       ");
  res.write("</html>                                        ");

  res.end();
});

server.on('close',function(){
  console.log('종료');
});
