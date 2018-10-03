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

var user = require('./routes/user');

//Express 객체생성
var app = express();

//기본 속성 설정
app.set('port', process.env.PORT||3000);

//body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}));

//body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

//public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));

//cookie-parser 설정
app.use(cookieParser());

//세션 설정
app.use(expressSession({
  secret:'my key',
  resave:true,
  saveUninitialized:true
}));

//몽고디비 모듈 사용
var MongoClient = require('mongodb').MongoClient;

//데이터베이스 객체를 위한 변수 선언
var database;

//데이터베이스 스키마 객체를 위한 변수 선언
var UserSchema;

//데이터베이스 모델 객체를 위한 변수 선언
var UserModel;

//데이터베이스에 연결
function connectDB(){
  //데이터베이스 연결정보
  var databaseUrl = 'mongodb://localhost:27017/local';

  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl,{ useNewUrlParser: true });
  database = mongoose.connection;

  database.on('error', console.error.bind(console, 'mongoose connection error.'));
  database.on('open', function(){
    console.log('데이터 베이스에 연결되었습니다. '+databaseUrl);

    //user 스키마 및 모델 객체 생성
    createUserSchema();
  });

  database.on('disconnected', function(){
    console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
    setInterval(connectDB, 5000);
  });
}

function createUserSchema(){
  //user_schema.js 모듈 불러오기.
  UserSchema = require('./database/user_schema').createSchema(mongoose);

  //UserModel 모델정의
  UserModel = mongoose.model("user3", UserSchema);

  //init 호출
  user.init(database, UserSchema, UserModel);
}

//사용자를 인증하는 함수 : 아이디로 먼저 찾고ㅓ 비밀번호를 그다음에 비교





//라우터 객체 참조
var router = express.Router();

//로그인 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/process/login').post(user.login);

//사용자 추가 라우팅 함수 - 클라이언트에서 보내온 데이터를 이용해 데이터베이스에 추가
router.route('/process/adduser').post(user.adduser);

//사용자 리스트 함수
router.route('/process/listuser').post(user.listuser);

//라우터 객체 등록
app.use('/', router);
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
  connectDB();
});
