module.exports = function(app, passport){
  console.log('user_passport 호출됨.');

  //홈 화면
  app.get('/',function(req,res){
    console.log('/ 패스 요청됨.');
    res.render('index.ejs');
  });

  //로그인 화면
  app.get('/login', function(req,res){
    console.log('/login 패스 요청됨.');
    res.render('login.ejs', {message : req.flash('loginMessage')});
  });

  //로그인 인증
  app.post('/login', passport.authenticate('local-login',{
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }));

  //회원가입 화면
  app.get('/signup', function(req,res){
    console.log('/signup 패스 요청됨.');
    res.render('signup.ejs', {message : req.flash('signupMessage')});
  });


  //회원가입 인증
  app.post('/signup', passport.authenticate('local-signup',{
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  //프로필 화면
  app.get('/profile',function(req,res){
    console.log('/profile 패스 요청됨.');

    //인증된 경우 req.user 객체에 사용자 정보 있으며, 인증이 안 된 경우 req.user는 false 값임
    console.log('req.user 객체의 값');
    console.dir(req.user);

    //인증이 안 된 경우
    if(!req.user){
      console.log('사용자 인증이 안 된 상태임.');
      res.redirect('/');
      return;
    }

    //인증된 경우
    console.log('사용자 인증된 상태임.');
    if(Array.isArray(req.user)){
      res.render('profile.ejs', {user : req.user[0]._doc});
    }else{
      res.render('profile.ejs', {user : req.user});
    }
  });

  //로그아웃
  app.get('/logout', function(req, res){
    console.log('/logout 패스 요청됨.');
    req.logout();
    res.redirect('/');
  });
};
