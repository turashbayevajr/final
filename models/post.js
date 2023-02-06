var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const postSchema = new Schema({
    unique_id: Number,
    user_id: Number,
    text:{
        type: String,
        // min: 10,
        required: true
    },
    img: {
        data: Buffer,
        contentType: String
    }
})
Post=mongoose.model('Post', postSchema);
module.exports = Post;