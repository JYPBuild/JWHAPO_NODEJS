//Express 기본 모듈 불러오기.
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

//crypto 모듈 불러들이기
var crypto = require('crypto');

//Express 미들웨어 불러오기.
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

//Session 미들웨어 불러오기
var expressSession = require('express-session');

var database = require('./database/database');
var config = require('./config/config');
var route_loader = require('./routes/route_loader');

//======Passport 사용 ==================//
var passport = require('passport'); //사용자 인증 처리에 필요한 기본 기능 제공
var flash = require('connect-flash'); // 요청객체에 메세지를 넣어 둘 수 있는 기능 제공
var session = require('express-session');
//Express 객체생성
var app = express();

//기본 속성 설정
app.set('port', config.server_port||3000);

//body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}));

//body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

//public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));

//뷰 엔진 설정
app.set('views', __dirname+ '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');
//cookie-parser 설정
app.use(cookieParser());

//=======================passport 사용 설정 ================//
app.use(session({ secret: 'anything' }));
app.use(passport.initialize()); // 초기화
app.use(passport.session()); // 로그인 세션 유지
app.use(flash());

//세션 설정
app.use(expressSession({
  secret:'my key',
  resave:true,
  saveUninitialized:true
}));


// 패스포트 설정
var configPassport = require('./config/passport');
configPassport(app, passport);
//라우팅 정보를 읽어 들여 라우팅 설정
var router = express.Router();
route_loader.init(app, router);

//패스포트 관련 함수 라우팅
var userPassport = require('./routes/user_passport');
userPassport(app, passport);

//=================404 오류 페이지 처리 =====================
var errorHandler = expressErrorHandler({
  static:{
    '404' : './public/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//=============서버 시작================
http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : '+ app.get('port'));

  //데이터 베이스 연결
  database.init(app,config);
});
