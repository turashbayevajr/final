var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const postSchema = new Schema({
    unique_id: Number,
    imageSrc:{
        type: String,
        default: ''
    },
    user:{
        ref: 'users',
        type:Schema.Types.ObjectId
    },
    text:{
        type: String,
        min: 10,
        required: true
    }
})
module.exports=mongoose.model('posts', postSchema)