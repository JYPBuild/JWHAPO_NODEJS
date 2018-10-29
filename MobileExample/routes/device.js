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

module.exports.adddevice = adddevice;
module.exports.listdevice = listdevice;
