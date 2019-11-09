var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs = require('fs');

const app = express();

const https = require('https');
const url = 'localhost/graph';

//formの内容取得
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var nodemailer = require('nodemailer');

//プロフィール画像のアップロード
var multer = require('multer');
var upload = multer({ dest: './public/images/uploads/'});

var saysSample = require('./remark');
var remark = saysSample.remark;

//mongodb関連
var model = require('./model');
var mongodb = require('mongodb');
var myData = model.schemaModel;

//formに空欄がないか確認するときに使用
var null_war = '';

//indexページget処理
router.get('/', function(req, res, next) {
  console.log(req.user);
  
  //ログイン情報がなければログイン画面にリダイレクト
  if(req.user == undefined){
    res.redirect('/login');
  }else{
    
    myData.findOne({hanne: req.user}, function(err, result){
      
      //レベル判定
      result.numMonster = result.greenMonster + result.redMonster + result.whiteMonster + result.blueMonster + result.pinkMonster + result.otherMonster;

      if(result.numMonster < 5){
        result.rank = 1;
      }else if(result.numMonster >= 5 && result.numMonster < 10){
        result.rank = 2;
      }else if(result.numMonster >= 10 && result.numMonster < 15){
        result.rank = 3;
      }else if(result.numMonster >= 15 && result.numMonster < 20){
        result.rank = 4;
      }else if(result.numMonster >= 20 && result.numMonster < 30){
        result.rank = 5;
      }else if(result.numMonster >= 30 && result.numMonster < 40){
        result.rank = 6;
      }else{
        result.rank = 000;
      }
      result.save(function(err){
        if(err){
          console.log(err);
        }else{
          var rank = result.rank;
          var image = result.profileImage;
          console.log('remark : ' + remark);
          console.log('saysSample.remark' + saysSample.remark);
          res.render('index', 
            { title: 'MonsterCounter',
            user: req.user,
            rank: rank,
            image: image,
            remark: remark
          });
        }
      });
    });
  }

});

//新規作成ページget処理
router.get('/newuser', function(req, res, next){
  if(req.session.war == true){
    null_war = '空欄を埋めてください。';
    req.session.war = null;
  }else{
    null_war = '';
  }
  res.render('newuser',
  { title: 'newuser page',
    null_war: null_war
  });
});

//新規作成ページpost処理
// upload.single('フォーム内inputのnameを選択')
router.post('/newuser', upload.single('profileImage'), function(req, res, next){

  //formに空欄があればリダイレクト
  if(req.body.hanne == "" || req.body.password == "" || req.body.fake_text_box == ''){
    console.log('redirect');
    req.session.war = true;
    res.redirect('/newuser');
    return;
  }

    
    //フォームの値を取得
    var hanne = req.body.hanne;
    var password = req.body.password;
    if(req.body.fake_text_box != ''){
      var image = req.file.filename;
    }    
    
    var usersdata = new myData({
      'hanne': hanne,
      'password': password,
      'rank': 0,
      'greenMonster': 0,
      'redMonster': 0,
      'whiteMonster': 0,
      'blueMonster': 0,
      'pinkMonster': 0,
      'otherMonster': 0,
      'numMonster': 0,
      'profileImage': image,
      'weekData': 0,
      'use': true
    });
    
    usersdata.save(function(err){
      if(err){
        console.log(err);
      }
      res.redirect('/login');
    });
});
  
//ログインページget処理
router.get('/login', function(req, res, next) {
  res.render('login', 
  { title: 'login page' ,
  // user: req.user
});
});

//ログインページpost処理
router.post('/login', passport.authenticate('local',
{ 
  successRedirect: '/',
  failureRedirect: 'login',
  session: true
}));

//ログアウトget処理
router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/login');
});

//ランキングページget処理
router.get('/rank', function(req, res, next){

  //ログイン情報がなければログイン画面にリダイレクト
  if(req.user == undefined){
    res.redirect('/login');
  }else{    
    
    //ユーザ情報をソートして取得
    myData.where().sort({'numMonster': 'desc'}).limit(10).exec(function(err, result){
      myData.where().sort({'weekData': 'desc'}).limit(10).exec(function(err, data){
        
        if(err){
          console.log(err);
        }else{
          var num = Object.keys(result).length; 
          res.render('rank', 
          { title: 'rank page' ,
            user: req.user,
            datas: result,
            weekDatas: data,
            num: num
          });
        }
      });
    });
  }
  
});

//グラフページget処理
router.get('/graph', function(req, res, next){

  //ログイン情報がなければログイン画面にリダイレクト
  if(req.user == undefined){
    res.redirect('/login');
  }else{
    res.render('graph', 
    { title: 'graph page' ,
      user: req.user  
    });
  }
});

//アカウント設定ページget処理
router.get('/acount', function(req, res, next){
  if(req.user == undefined){
    res.redirect('/login');
  }else{

    myData.findOne({hanne: req.user}, function(err, result){
      
      var hanne = result.hanne;
      var password = result.password;
    
      if(req.session.war == true){
        null_war = 'IDとパスワードを空欄にしないでください。';
        req.session.war = null;
      }else{
        null_war = '';
      }

      res.render('acount', 
      { title: 'acount setting page',
        user: req.user,
        hanne: hanne,
        password: password,
        null_war: null_war
      });  
    });
  }
});

//アカウント設定ページpost処理
router.post('/acount', upload.single('profileImage'), function(req, res, next){
  //ログイン情報がなければログイン画面にリダイレクト
  if(req.user == undefined){
    res.redirect('/login');
  }else{

    //formに空欄があればリダイレクト
    if(req.body.username == "" || req.body.password == ""){
      console.log('redirect');
      req.session.war = true;
      res.redirect('/acount');
      return;
    }

    console.log('req.body.fake_text_box' + req.body.fake_text_box);
    if(req.body.fake_text_box == ''){
      console.log('req.body.profileImage無し');
    }else{
      var new_profileImage = req.file.filename;
    }

    var new_username = req.body.username;
    var new_password = req.body.password;    

    myData.findOne({hanne: req.user}, function(err, result){
      
      result.hanne = new_username;
      result.password = new_password;
      if(new_profileImage === undefined){
        console.log('new_profileImage無し');
      }else{
        result.profileImage = new_profileImage;
      }
      
      result.save(function(err){
        if(err){
          console.log(err);
        }else{
          req.logout();
          res.redirect('/change');
        }
      });
    });
  }
  
});

//変更反映ページget処理
router.get('/change',function(req, res, next){
  res.render('change',
  { title: 'acount setting page',
    msg: '変更が完了しました。<br>お手数ですが再度ログインをお願いします。<br>'
});
});

//お問い合わせページget処理
router.get('/form', function(req, res, next){
  if(req.user == undefined){
    res.redirect('/login');
  }else{

    if(req.session.war == true){
      null_war = '空欄を埋めてください。';
      req.session.war = null;
    }else{
      null_war = '';
    }
    res.render('form', 
    { title: 'form page',
      user: req.user,
      null_war: null_war
    });

  }
});

router.post('/form', function(req, res, next){

  if(req.body.mail == "" || req.body.message == ""){
    console.log('redirect');
    req.session.war = true;
    res.redirect('/form');
    return;
  }

  var address = req.body.mail;
  var text = req.body.message;

  //メッセージ内容
  var message = {
    form: 'chinoknct@gmail.com',
    to: 'g1822007@tcu.ac.jp',
    subject: 'お問い合わせ',
    text: address + '\n' + text
  };

  //smtpサーバ設定
  var smtp = nodemailer.createTransport({
    //ここでgmail送信用の設定を追加
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'chinoknct@gmail.com',
      pass: 'yutayuta321'
    }
  });

  //メール送信処理
  try{
    smtp.sendMail(message, function(error, info){
      if(error){
        console.log('送信失敗');
        console.log(error.message);
        return;
      }

      console.log('送信成功');
      console.log(info.messageId);
    });
  }catch(e){
    console.log('error', e);
  }

  res.redirect('/form');
});

module.exports = router;
