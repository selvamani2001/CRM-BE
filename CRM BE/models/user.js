const { default: mongoose } = require("mongoose");
 
const userSchema =new mongoose.Schema({
    name: String,
    email: String,
    aternateEmail: String,
    address: String,
    gender:String,
    Contact:Number,
    passwordHash: String,
    activationToken: String,
    activated: { type: Boolean, default: false },
    reset_OTP: String,
    userRole:String
})
const User = mongoose.model('User', userSchema, 'users')

module.exports = User;