var express = require('express');
var router = express.Router();

var app = express();
var num = 0;

var says = [
    '仕上がってるよ仕上がってるよ',
    '魔剤飲んでるね～えらいね～すごいね～',
    'ほぅ、、炭酸抜き魔剤ですか、、、',
    'え？今日はまだ魔剤を飲んでいない？？？今すぐ買ってこよう！！！'
]

var shuffle = function(num){
    num = Math.floor(Math.random() * (says.length - 1));
    data = says[num];
};

shuffle();
var remark = data;

module.exports.remark = remark;