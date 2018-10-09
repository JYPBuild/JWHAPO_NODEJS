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
var config = require('./config');
var route_loader = require('./routes/route_loader');

//======Passport 사용 ==================//
var passport = require('passport'); //사용자 인증 처리에 필요한 기본 기능 제공
var flash = require('connect-flash'); // 요청객체에 메세지를 넣어 둘 수 있는 기능 제공

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
app.use(passport.initialize()); // 초기화
app.use(passport.session()); // 로그인 세션 유지
app.use(flash());

//세션 설정
app.use(expressSession({
  secret:'my key',
  resave:true,
  saveUninitialized:true
}));

route_loader.init(app, express.Router());

//=================404 오류 페이지 처리 =====================
var errorHandler = expressErrorHandler({
  static:{
    '404' : './public/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var LocalStrategy = require('passport-local').Strategy;

//패스포트 로그인 설정
passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
}, function(req,email,password,done){
  console.log('passport의 local-login 호출됨 : ' + email + ', '+password);

  var database = app.get('database');
  database.UserModel.findOne({'email' : email}, function(err,user){
    if(err) {return done(err);}

    //등록된 사용자가 없는 경우
    if(!user){
      console.log('계정이 일치하지 않음');
      return done(null, false,req.flash('loginMessage', '등록된 계정이 없습니다.'));
    }

    //비밀번호를 비교하여 맞지 않는 경우
    var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
    if(!authenticated){
      console.log('비밀번호 일치하지 않음.');
      return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));
    }

    //정상인 경우
    console.log('계정과 비밀번호가 일치함.');
    return done(null,user);
  });
}));

//패스포트 회원가입 설정
passport.use('local-signup',new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
}, function(req, email, password, done){
  //요청 파라미터 중 name 파라미터 확인
  var paramName = req.body.name || req.query.name;
  console.log('passport의 local-signup 호출됨 : '+email+ ', '+password + ', ' + paramName);

  //User.findOne이 blocking되므로 async 방식으로 변경할 수도 있음.
  process.nextTick(function(){
    var database = app.get('database');
    database.UserModel.findOne({'email' : email}, function(err, user){
      //오류
      if(err){
        return done(err);
      }

      //기존에 이메일이 있다면
      if(user){
        console.log('기존에 계정이 있음.');
        return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));
      }else{
        //모델 인스턴스 객체 만들어 저장
        user = new database.UserModel({'email' : email, 'password' : password, 'name' : paramName});

        user.save(function(err){
          if(err) {throw err;}
          console.log('사용자 데이터 추가함.');
          return done(null,user);
        });
      }
    });
  });
}));

//사용자 인증에 성공했을 때 호출
passport.serializeUser(function(user, done){
  console.log('serializeUser() 호출됨.');
  console.dir(user);

  done(null,user);
});

//사용자 인증 이후 사용자 요청이 있을 때마다 호출
passport.deserializeUser(function(user,done){
  console.log('deserializeUser() 호출됨.');
  console.dir(user);

  done(null,user);
});

//=============서버 시작================
http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : '+ app.get('port'));

  //데이터 베이스 연결
  database.init(app,config);
});
