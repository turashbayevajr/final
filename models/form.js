var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const formsSchema = new Schema({
    unique_id: Number,
    user_id: Number,
    message:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    }
});
Form =mongoose.model('Form', formsSchema);
module.exports = Form;