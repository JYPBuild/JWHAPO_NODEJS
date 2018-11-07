

module.exports = {
  server_port : 3000,
  db_url : 'mongodb://localhost:27017/local',
  fcm_api_key: 'AAAA7hjWEm0:APA91bEDf6XV-3syuosyJQ4AmUYjWOiQ3oFfaFBEWiR0B2e5riNjdH3gjIjX5ZEDSSgFPOUdbtDaVj0IDyddqrCyhZfC3YvZaZ3knku-tO1o1kJEX3L1K7a0h2AaPXNWtECgH5D0sQfP',
  db_schemas: [
    {file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'},
    {file:'./device_schema', collection:'devices', schemaName:'DeviceSchema', modelName:'DeviceModel'}
  ],
  route_info : [
    {file : './user', path : '/process/listuser', method : 'listuser', type : 'post'},
    {file : './device', path : '/process/adddevice', method : 'adddevice', type : 'post'},
    {file : './device', path : '/process/listdevice', method : 'listdevice', type : 'post'},
    {file : './device', path : '/process/register', method : 'register', type : 'post'},
    {file : './device', path : '/process/sendall', method : 'sendall', type : 'post'}
  ]
};
