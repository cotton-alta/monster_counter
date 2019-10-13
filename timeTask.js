var SelfTimer = require('self-timer');
var st = new SelfTimer(new Date());

//app.jsに挿入
st.on().Sunday(function(){
	//コールバック処理
	
	//mongodbのユーザーデータweekDataを0にする
	//model = コレクション名
	model.update(function(err, model){
		weekData = 0;
	});
	console.log('日曜日に実行');
});