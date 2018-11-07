var config = require('../config/config');
var fcm = require('node-gcm');

var adddevice = function(req, res){
  console.log('디바이스 모듈 안에 adddevice 호출.');

  var database = req.app.get('database');

  var paramMobile = req.body.mobile || req.query.mobile;
  var paramOsVersion = req.body.osVersion || req.query.osVersion;
  var paramModel = req.body.model || req.query.model;
  var paramDisplay = req.body.display || req.query.display;
  var paramManufacturer = req.body.manufacturer || req.query.manufacturer;
  var paramMacAddress = req.body.macAddress || req.query.macAddress;

  console.log('요청 파라미터 : '+paramMobile+', '+paramOsVersion + ', '+paramModel +', '+paramDisplay+', '+paramManufacturer +', '+paramMacAddress);

  //데이터베이스 객체가 초기화된 경우
  if(database.db){
    //DeviceModel 인스턴스생성
    var device = new database.DeviceModel({"mobile":paramMobile, "osVersion":paramOsVersion,"model":paramModel,"display":paramDisplay,"manufacturer":paramManufacturer,"macAddress":paramMacAddress});

    //save()로 저장
    device.save(function(err){
      if(err){
        console.error('단말 정보 추가 중 오류 발생 : '+err.stack);

        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>단말 정보 추가 중 오류 발생</h2>');
        res.write('<p>' + err.stack + '</p>');
        res.end();

        return;
      }

      console.log('단말 데이터 추가함.');
      console.dir(device);

      res.writeHead('200', {'Content-Type':'application/json;charset=utf8'});
      res.write("{code:'200', 'message':'단말 데이터 추가 성공'}");
      res.end();
    });
  }
};
var listdevice = function(req, res){
  console.log('디바이스 모듈안에 있는 listdevice 호출됨.');

  var database = req.app.get('database');

  //데이터 베이스 객체가 초기화된 경우
  if(database.db){
    //1. 모든 단말 검색
    database.DeviceModel.findAll(function(err,results){
      if(err){
        console.error('단말 리스트 조회 중 오류 발생 : '+ err.stack);
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>단말 리스트 조회 중 오류 발생</h2>');
        res.write('<p>' + err.stack + '</p>');
        res.end();

        return;
      }

      if(results){
        console.dir(results);

        var context = {
          title : '단말 목록',
          devices : results
        };
        req.app.render('listdevice', context, function(err,html){
          res.end(html);
        });
      }
    });
  }
};

var register = function(req, res){
  console.log('device 모듈안에 있는 rehister 모듈 호출함.');

  var database = req.app.get('database');

  var paramMobile = req.body.mobile||req.query.mobile;
  var paramRegistrationId = req.body.registrationId||req.query.registrationId;

  console.log('요청 파라미터 : '+ paramMobile + ', ' + paramRegistrationId);

  //데이터베이스 객체가 초기화된 경우
  if(database.db){
      //업데이트
      database.DeviceModel.findOneAndUpdate({mobile:paramMobile}, {registrationId:paramRegistrationId},{multi:true}, function(err,result){
        if(err){
          console.error('단말 등록 중 오류 발생 : ' + err.stack);

          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>단말 등록 중 오류 발생 </h2>');
          res.write('<p>'+err.stack +'</p>');
          res.end();

          return;
        }

        if(result){
          console.log('등록 ID 업데이트함.');
          console.dir(result);

          res.writeHead('200', {'Content-Type':'application/json;charset=utf8'});
          res.write("{code:'200', 'message':'등록 ID 업데이트 성공'}");
          res.end();
        }else{
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2> 등록 ID 없음. </h2>');
          res.end();
        }
      });
  }
};

var sendall = function(req, res){
  console.log('device 모듈안에 있는 sendall 호출됨.');

  var database = req.app.get('database');
  var paramData = req.body.data||req.query.data ;

  console.log('요청 파라미터 : '+ paramData);

  //데이터베이스 객체가 초기화된 경우
  if(database.db){
      //모든단말검색
    database.DeviceModel.findAll(function(err,results){
      if(err){
        console.error('푸시 전송을 위한 조회 중 오류발생 : ' + err.stack);

        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>푸시 전송을 위한 조회 중 오류발생 </h2>');
        res.write('<p>'+err.stack +'</p>');
        res.end();

        return;
      }
      if(results){
        console.dir(results);

        //등록 ID만 추출
        var regIds = [];
        for(var i=0; i<results.length; i++){
          var curId = results[i]._doc.registrationId;
          console.log('등록 ID #'+i+' :'+regIds.length);
          console.log('curId #'+i+' :'+curId);
          regIds.push(curId);
        }
        console.log('전송 대상 단말 수 : '+regIds.length);

        //node-gcm을 이용해 전송
        var message = new fcm.Message();
        message.addData('command', 'show');
        message.addData('type', 'text/plain');
        message.addData('data',paramData);

        var sender = new fcm.Sender(config.fcm_api_key);
        sender.send(message, regIds,function(err,result){
          if(err) {throw err;}
          console.dir(result);
          res.writeHead('200',{'Content-Type' : 'text/html;charset=utf8'});
          res.write('<h2> 푸시 메시지 성공 </h2>');
          res.end();
        });
      }

    });
  }

};

module.exports.adddevice = adddevice;
module.exports.listdevice = listdevice;
module.exports.register = register;
module.exports.sendall = sendall;
