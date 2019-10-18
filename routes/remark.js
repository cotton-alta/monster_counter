var express = require('express');
var router = express.Router();

var app = express();
var num = 0;

var says = [
    '仕上がってるよ<br>仕上がってるよ<br>筋トレ後は30分以内に魔剤だ',
    '魔剤飲んでるね～<br>えらいね～すごいね～～',
    'ほぅ・・・<br>炭酸抜き魔剤ですか・・・',
    '今日はまだ魔剤を飲んでいない？<br>今すぐ買ってこよう！',
    'おめでとう<br>君の魔剤は叶えられる'
]

var shuffle = function(num){
    num = Math.floor(Math.random() * (says.length - 1));
    data = says[num];
};

shuffle();
var remark = data;

module.exports.remark = remark;