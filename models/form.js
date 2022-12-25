var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const formSchema = new Schema({
    unique_id: Number,
    user:{
        ref: 'users',
        type:Schema.Types.ObjectId
    },
    message:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    }
})
module.exports=mongoose.model('forms', formSchema)