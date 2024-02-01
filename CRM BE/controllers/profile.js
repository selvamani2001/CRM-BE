const User = require("../models/user");

const profileDetailes={
    profile: async (req,res) => {
        try {
            const { name, email, aternateEmail, Contact, gender, address } = req.body;
            const userId = req.userId;
            const user = await User.findById(userId)
            if (user) {
                user.email = email
                user.name = name
                user.aternateEmail = aternateEmail;
                user.Contact = Contact;
                user.gender = gender;
                user.address = address;

                await user.save();
                return res.status(200).json({message:'update profile'})
            }
            return res.status(200).json({message:'update fail profile'})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:'update profile error'})
        }
    },
    getProfile: async (req, res) => {
        const userId = req.userId;
        try {
            const user = await User.findById(userId)
            if (user) {
                return res.status(200).json(user)
            }
            return res.status(400).json({message:'profile error'})
        } catch (error) {
            return res.status(500).json({message:'internal error'})
        }
    }
}
 module.exports =profileDetailes