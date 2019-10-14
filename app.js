var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var qs = require('querystring');

var passport = require('passport');
var LacalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var countRouter = require('./routes/count');

//時間処理
var SelfTimer = require('self-timer');
var st = new SelfTimer(new Date());

//mongodb関連
var model = require('./routes/model');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var myData = model.schemaModel;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//パスワード認証セッションミドルウェア設定
app.use(session({ resave:false, saveUninitialized:false, secret: 'passport test'}));

//パスワード認証
app.use(passport.initialize());
app.use(passport.session());
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
  session: false
  },function(req, username, password, done){
    process.nextTick(function(){
      
      //mongodbから該当するユーザ名とパスワードを検索
      myData.find({hanne: username}, function(err, result){
        if(result == ''){
          return done(null, false, { message: 'パスワードが一致しません。'})
        }
        var dbpassword = result[0].password;

        console.log(result.hanne);
        console.log('result ; ' + result);
        console.log('data.password' + result.password);
        console.log('username ' + username);

        if(password == dbpassword){
          return done(null, username)
        } else{
          console.log('ログイン失敗');
          return done(null, false, { message: 'パスワードが一致しません。'})
        }

      })

    })
  }
));

//パスワード認証のシリアライズ、デシリアライズ
passport.serializeUser(function(user, done){
  done(null, user);
});
passport.deserializeUser(function(user, done){
  done(null, user);
});

//ルーティング設定
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/count',countRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

st.on().Sunday(function(){
	//コールバック処理
	
	//mongodbのユーザーデータweekDataを0にする
	//model = コレクション名
	myData.updateMany({
    use: true 
  },{ $set: { 
    weekData: 0 
  } }, function(err){
    if(err){
      console.log(err);
    }
	});
	console.log('日曜日に実行');
});

//サーバ起動
var server = app.listen(80, function(){
  console.log('server running ...');
});

module.exports = app;
