var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PostSchema = new Schema({
    username: String,
    profilePic: String,
    text: String,
    timestamp: Number
})

mongoose.model('Post', PostSchema);