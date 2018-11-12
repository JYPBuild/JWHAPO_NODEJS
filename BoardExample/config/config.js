

module.exports = {
  server_port : 5000,
  db_url : 'mongodb://test02:156158asD!@ds033679.mlab.com:33679/heroku_trw5rqms',
  db_schemas: [
    {file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'},
    {file:'./post_schema', collection:'post', schemaName : 'PostSchema', modelName : 'PostModel'}
  ],
  route_info : [
    {file : './post', path : '/process/addpost', method : 'addpost', type : 'post'},
    {file : './post', path : '/process/showpost/:id', method : 'showpost', type : 'get'},
    {file : './post', path : '/process/listpost', method : 'listpost', type : 'post'},
    {file : './post', path : '/process/listpost', method : 'listpost', type : 'get'}
  ]
};
