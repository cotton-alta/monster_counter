var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaModel = new Schema({
    'hanne': String,
    'password': String,
    'rank': Number,
    'greenMonster': Number,
    'redMonster': Number,
    'whiteMonster': Number,
    'blueMonster': Number,
    'numMonster': Number,
    'profileImage': String
});

mongoose.connect('mongodb://127.0.0.1/monsters');

exports.schemaModel = mongoose.model('schemaModel', schemaModel);