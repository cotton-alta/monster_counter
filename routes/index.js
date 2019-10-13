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

var d3 = require("d3");

//プロフィール画像のアップロード
var multer = require('multer');
var upload = multer({ dest: './public/images/uploads/'});

var saysSample = require('./remark');
var remark = saysSample.remark;

//DOM操作用
// var Canvas = require('canvas');
// var tauCharts = require('taucharts');
// var d3 = require('d3');
// var dom = require('express-jsdom')(server);

//mongodb関連
var model = require('./model');
var mongodb = require('mongodb');
var myData = model.schemaModel;


//indexページget処理
router.get('/', function(req, res, next) {
  console.log(req.user);
  
  //ログイン情報がなければログイン画面にリダイレクト
  if(req.user == undefined){
    res.redirect('/login');
  }else{
    
    myData.findOne({hanne: req.user}, function(err, result){
      
      //レベル判定
      result.numMonster = result.greenMonster + result.redMonster + result.whiteMonster + result.blueMonster;

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
  res.render('newuser',
  { title: 'newuser page'
  });
});

//新規作成ページpost処理
// upload.single('フォーム内inputのnameを選択')
router.post('/newuser', upload.single('profileImage'), function(req, res, next){

    //フォームの値を取得
    var hanne = req.body.hanne;
    var password = req.body.password;
    var image = req.file.filename;

    console.log('req.body.hannne : ' + req.body.hanne);
    console.log('req.body.password : ' + req.body.password);
    

    var usersdata = new myData({
      'hanne': hanne,
      'password': password,
      'rank': 0,
      'greenMonster': 0,
      'redMonster': 0,
      'whiteMonster': 0,
      'blueMonster': 0,
      'numMonster': 0,
      'profileImage': image
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

//ランキングページget処理
router.get('/rank', function(req, res, next){

  //ログイン情報がなければログイン画面にリダイレクト
  if(req.user == undefined){
    res.redirect('/login');
  }else{
    //ユーザ情報をソートして取得
    myData.where().sort({'numMonster': 'desc'}).limit(10).exec(function(err, result){
      if(err){
        console.log(err);
      }else{
        var num = Object.keys(result).length; 
        res.render('rank', 
          { title: 'rank page' ,
          user: req.user,
          datas: result,
          num: num
        });
      }
    });
  }
  
});


// dom.get('/hello', function(document) {
//   document.title = 'Hello World';
// });


// https.get(url, res => {
//   let html = '';
//   res.on('data', line => html += line);
//   res.on('end', () => {
//     console.log(html);
//   });
// });

//グラフページget処理
router.get('/graph', function(req, res, next){

  //ログイン情報がなければログイン画面にリダイレクト
  if(req.user == undefined){
    res.redirect('/login');
  }else{

    // var svg = d3.select("body");

    console.log(req.html);

    res.render('graph', 
    { title: 'graph page' ,
    user: req.user
  });


  // fs.readFile('/public/graph.html', 'UTF-8', function(err, data){
  //   res.setHeader('Content-Type', 'text/html');
  //   res.end(data);
  // });
}

});

module.exports = router;
