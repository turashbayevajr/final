var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema( {
	
	unique_id: Number,
	username: String,
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
	  },
	  password: {
		type: String,
		required: true,
	  },
	passwordConf: {
		type: String,
		required: true,
	  },
})
userSchema.pre('save', async function (next) {
	try {
	  /* 
	  Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
	  */
	  if (this.isNew) {
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(this.password, salt)
		const hashedPasswordConf = await bcrypt.hash(this.password, salt)
		this.password = hashedPassword
		this.passwordConf = hashedPasswordConf 
	  }
	  next()
	} catch (error) {
	  next(error)
	}
  })
  
  userSchema.methods.isValidPassword = async function (password) {
	try {
	  return await bcrypt.compare(password, this.password)
	} catch (error) {
	  throw error
	}
  }
  userSchema.methods.isValidPassword = async function (passwordConf) {
	try {
	  return await bcrypt.compare(passwordConf, this.passwordConf)
	} catch (error) {
	  throw error
	}
  }


User = mongoose.model('User', userSchema);

module.exports = User;