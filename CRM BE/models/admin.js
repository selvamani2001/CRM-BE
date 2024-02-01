const { default: mongoose } = require("mongoose");

const adminSchema =new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    reset_OTP: String,
    activationToken: String,
    activated: { type: Boolean, default: false },
    tickets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }
    ],
    userRole:String
})
const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin;