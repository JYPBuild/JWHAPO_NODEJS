/**
* 로그 파일 남기기
* console 객체의 log() 또는 error() 메소드 등을 호출하면 로그를 출력할 수 있다.
* 그런데 프로그램의 크기가 커질수록 로그의 양도 많아지고 로그를 보관했다가 나중에 확인해야 하는 경우도 생긴다.
* 따라서 어떻게 로그를 남기고 보관할 것인지가 중요해진다.
* 로그롤 보관하려면 화면에만 출력하는 것만으로 부족하며 다양한 방식으로 로그를 남길 수 있도록 외부 모듈을 사용한다.
* winston 모듈로 로그를 남기는 방법을 알아보자.
*
* 로그를 남기려면 설정이 필요하다.
* 이렇게 설정한 코드는 한번 만들어 두면 그대로 복사한 후 일부 설정만 바꾸어 다른 프로그램에도 사용할 수 있다.
*/

var winston = require('winston');   // 로그처리 모듈
var winstonDaily = require('winston-daily-rotate-file');  // 로그 일별 처리 모듈
var moment = require('moment');

function timeStampFormat(){
  return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
};

var logger = new (winston.Logger)({
  transports: [
    // 파일로 출력되는 정보 설정
    new (winstonDaily)({
      name: 'info-file'
      ,filename: './log/server'
      ,datePattern: '_yyyy-MM-DD' // 원래 뒤에 .log 까지 찍어서 확장자 log 파일이 만들어지는데, 내 컴에선 에러가난다...그래서 뺏다.
      ,colorize: false
      ,maxsize: 50000000
      ,maxFiles: 1000
      ,level: 'info'
      ,showLevel: true
      ,json: false
      ,timestamp: timeStampFormat
    }),
    //콘솔로 뿌려지는 정보 세팅
    new (winston.transports.Console)({
      name: 'debug-console'
      ,colorize: true
      ,level: 'debug'
      ,showLevel: true
      ,json: false
      ,timestamp:timeStampFormat
    })
  ],
  exceptionHandlers:[
    new (winstonDaily)({
      name: 'exception-file'
      ,filename: './log/exception'
      ,datePattern: '_yyyy-MM-dd'// 원래 뒤에 .log 까지 찍어서 확장자 log 파일이 만들어지는데, 내 컴에선 에러가난다...그래서 뺏다.
      ,colorize: false
      ,maxsize: 50000000
      ,maxFiles: 1000
      ,level: 'error'
      ,showLevel: true
      ,json: false
      ,timestamp: timeStampFormat
    }),
    new(winston.transports.Console)({
      name: 'exception-console'
      ,colorize: true
      ,level: 'debug'
      ,showLevel: true
      ,json: false
      ,timestamp:timeStampFormat
    })
  ]
});

logger.debug('디버깅 메시지입니다');
logger.error('에러 메시지입니다.');
/**
* 위 코드는 winston 모듈 외에 winston-daily-rotate-file 모듈과 시간을 다룰 수 있는 moment 모듈도 사용한다.
* 따라서 파일을 실행하기 전에 먼저 아래 명령을 통해 모듈을 설치해야 한다.
*  npm install winston --save
*  npm install winston-daily-rotate-file --save
*  npm install moment --save
*/
/**
* Do you know 'Log Level'??
* 어느 정보까지 출력할 것인지 결정하는 것
* 예를 들어, 오류만 보여줄 것인지 아니면 사소한 정보까지 모두 보여 줄 것인지 결정하는 것.
*
* debug:0 > info:1 >notice:2 >warning:3> error:4 > crit:5 > alert:6 > emerg: 7
*/
