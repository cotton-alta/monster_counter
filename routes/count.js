var express = require('express');
var router = express.Router();

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//mongodb関連
var model = require('./model');
var mongodb = require('mongodb');
var myData = model.schemaModel;

//カウントページget処理
router.get('/', function(req, res, next){
  
    //ログイン情報がなければログイン画面にリダイレクト
    if(req.user == undefined){
      res.redirect('/login');
    }else{
      myData.find({hanne: req.user}, function(err, result){
        
        var greenMonster = result[0].greenMonster;
        var redMonster = result[0].redMonster;
        var whiteMonster = result[0].whiteMonster;
        var blueMonster = result[0].blueMonster;
        
        res.render('count', 
        { title: 'count page',
        user: req.user,
        greenMonster: greenMonster,
        redMonster: redMonster,
        whiteMonster: whiteMonster,
        blueMonster: blueMonster
      });
    });
  }
  });
  
  //カウントアップ 緑魔剤
  router.get('/countUpGreen', function(req, res, next){
  
    if(req.user == undefined){
      res.redirect('/login');
    }else{
      myData.findOne({hanne: req.user}, function(err, result){
        
        result.greenMonster += 1;
        console.log(result.greenMonster);
        result.save(function(err){
          if(err){
            console.log(err);
          }
          res.redirect('/count');
        });
      });
    }
  });
  
  //カウントダウン 緑魔剤
  router.get('/countDownGreen', function(req, res, next){
  
    if(req.user == undefined){
      res.redirect('/login');
    }else{
      myData.findOne({hanne: req.user}, function(err, result){
        if(result.greenMonster <= 0){
          res.redirect('/count');
        }else{
          result.greenMonster -= 1;
          result.save(function(err){
            if(err){
              console.log(err);
            }
            res.redirect('/count');
          });
        }
      });
    }
  });
  
  //カウントアップ 赤魔剤
  router.get('/countUpRed', function(req, res, next){
  
    if(req.user == undefined){
      res.redirect('/login');
    }else{
      myData.findOne({hanne: req.user}, function(err, result){
        
        result.redMonster += 1;
        console.log(result.redMonster);
        result.save(function(err){
          if(err){
            console.log(err);
          }
          res.redirect('/count');
        });
      });
    }
  });
  
  //カウントダウン 赤魔剤
  router.get('/countDownRed', function(req, res, next){
  
    if(req.user == undefined){
      res.redirect('/login');
    }else{
      myData.findOne({hanne: req.user}, function(err, result){
        if(result.redMonster <= 0){
          res.redirect('/count');
        }else{
          result.redMonster -= 1;
          result.save(function(err){
            if(err){
              console.log(err);
            }
            res.redirect('/count');
          });
        }
      });
    }
  });
  
  //カウントアップ 白魔剤
  router.get('/countUpWhite', function(req, res, next){
  
    if(req.user == undefined){
      res.redirect('/login');
    }else{
      myData.findOne({hanne: req.user}, function(err, result){
        
        result.whiteMonster += 1;
        result.save(function(err){
          if(err){
            console.log(err);
          }
          res.redirect('/count');
        });
      });
    }
  });
  
  //カウントダウン 白魔剤
  router.get('/countDownWhite', function(req, res, next){
  
    if(req.user == undefined){
      res.redirect('/login');
    }else{
      myData.findOne({hanne: req.user}, function(err, result){
        if(result.whiteMonster <= 0){
          res.redirect('/count');
        }else{
          result.whiteMonster -= 1;
          result.save(function(err){
            if(err){
              console.log(err);
            }
            res.redirect('/count');
          });
        }
      });
    }
  });
  
  //カウントアップ 青魔剤
  router.get('/countUpBlue', function(req, res, next){
  
    if(req.user == undefined){
      res.redirect('/login');
    }else{
      myData.findOne({hanne: req.user}, function(err, result){
        
        result.blueMonster += 1;
        result.save(function(err){
          if(err){
            console.log(err);
          }
          res.redirect('/count');
        });
      });
    }
  });
  
  //カウントダウン 青魔剤
  router.get('/countDownBlue', function(req, res, next){
  
    if(req.user == undefined){
      res.redirect('/login');
    }else{
      myData.findOne({hanne: req.user}, function(err, result){
        if(result.blueMonster <= 0){
          res.redirect('/count');
        }else{
          result.blueMonster -= 1;
          result.save(function(err){
            if(err){
              console.log(err);
            }
            res.redirect('/count');
          });
        }
      });
    }
  });

module.exports = router;
