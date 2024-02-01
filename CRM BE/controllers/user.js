const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const Admin = require('../models/admin');
const { JWT_SECRET } = require('../config');

const usercontrollers = {
  signup: async (req, res) => {
    const { name, email, password, userRole } = req.body;
    if (userRole == "customer") {
      try {
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.json({ message: 'This email is already in use. Try another email or sign in to your account.' });
          }
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
          name, email, passwordHash,userRole
        });
        await user.save();
        return res.status(200).json({ message: 'User created successfully' });
      } catch (e) {
        console.log('Signup error', e);
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      try {
          const existingUser = await Admin.findOne({ email })
          if (existingUser) {
            return res.json({ message: 'This email is already in use. Please try another email or sign in to your account.' })
          }
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new Admin({
          name, email, passwordHash,userRole
        });

        await user.save()
        return res.status(200).json({ message: 'User created successfully' })
      } catch (e) {
        console.log('Signup error', e)
        return res.status(500).json({ message: 'Internal error' });
      }
    }
  },

  signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      const admin = await Admin.findOne({ email });

      if (user) {
        if (user.activated) {
          const passwordCheck = await bcrypt.compare(password, user.passwordHash);

          if (!passwordCheck) {
            return res.json({ message: "Password is incorrect" });
          }

          const Token = await jwt.sign({
            email: email,
            id: user._id
          }, JWT_SECRET);

          return res.json({ Token,user });
        } else {
          return res.json({ message: 'Go to your email and click the activation link to login.' });
        }
      } else if (admin) {
        const passwordCheck = await bcrypt.compare(password, admin.passwordHash);

        if (!passwordCheck) {
          return res.json({ message: "Password is incorrect" });
        }

        const Token = await jwt.sign({
          email: email,
          id: admin._id
        }, JWT_SECRET);

        return res.json({ Token, user:admin});
      } else {
        return res.json({ message: 'User not found!' });
      }
    } catch (e) {
      console.log('Signin error', e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  resetPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      const admin = await Admin.findOne({ email });

      if (user) {
        const OTP = Math.random().toString(36).slice(-6);
        user.reset_OTP = OTP;
        await user.save();
        usercontrollers.sendResetEmail(email, OTP, res);
      } else if (mentee) {
        const OTP = Math.random().toString(36).slice(-6);
        admin.reset_OTP = OTP;
        await admin.save();
        usercontrollers.sendResetEmail(email, OTP, res);
      } else {
        return res.json({ message: 'User or Mentee not found with the given email' });
      }
    } catch (error) {
      console.error(error);
      return res.json({ message: 'Error during password reset' });
    }
  },

  sendResetEmail: (email, OTP, res) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '143.lovvable@gmail.com',
        pass: 'fnmxhibtwjgdzajq',
      },
    });

    const link =` https://customer-relationship.netlify.app/reset-password/new-password/${OTP}`;

    const mailOptions = {
      from: 'Password_reset_noreply@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      text:` You are receiving this email because you requested a password reset for your account.\n\n Please use the following link to reset your password: ${link} \n\n If you did not request a password reset, please ignore this email.,`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.json({ message: 'Error sending reset email' });
      } else {
        return res.json({ message: 'Reset email sent successfully' });
      }
    });
  },

  newpassword: async (req, res) => {
    try {
      const { OTP } = req.params;
      const { password } = req.body;
      if (!password) {
        return res.json({ message: "Please enter the new password" });
      }
      const user = await User.findOne({ reset_OTP: OTP });
      const admin = await Admin.findOne({ reset_OTP: OTP });
  
      if (user) {
        const NewPass = await bcrypt.hash(password, 10);
        user.passwordHash = NewPass;
        user.reset_OTP = null;
        await user.save();
        res.json({ message: "Password reset successfully" });
      } else if (admin) {
        const NewPass = await bcrypt.hash(password, 10);
        admin.passwordHash = NewPass;
        admin.reset_OTP = null;
        await admin.save();
        res.json({ message: "Password reset successfully" });
      } else {
        return res.json({ message: "Invalid OTP" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  

  activetlikesent: async (req, res) => {
    const { email } = req.params;
    const user = await User.findOne({ email });
    const admin=await Admin.findOne({email})
    console.log(user,admin)

    if (user) {
      if (user.activated) {
        return res.json({ message: 'User Already Activated' });
      }
      const activationToken = Math.random().toString(36).slice(-10);
      user.activationToken = activationToken;    
      await user.save()
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '143.lovvable@gmail.com',
          pass: 'fnmxhibtwjgdzajq',
        },
      });
  
      const activationLink = ` https://customer-relationship.netlify.app/activate-account/${activationToken}`;
      const mailOptions = {
        from: 'noreply@example.com',
        to: email,
        subject: 'Activate Your Account',
        text:` Welcome to the site! Please click the following link to activate your account: ${activationLink}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.json({ message: 'Error sending activation email' });
        } else {
          return res.json({ message: 'Activation email sent successfully' });
        }
      });
    }
    if (admin) {
      if (admin.activated) {
        return res.json({ message: 'User Already Activated' });
      }
      const activationToken = Math.random().toString(36).slice(-10);
      admin.activationToken = activationToken;
      await admin.save()
    
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '143.lovvable@gmail.com',
          pass: 'fnmxhibtwjgdzajq',
        },
      });

      const activationLink = ` https://customer-relationship.netlify.app/activate-account/${activationToken}`;
      const mailOptions = {
        from: 'noreply@example.com',
        to: email,
        subject: 'Activate Your Account',
        text: ` Welcome to the site! Please click the following link to activate your account: ${activationLink}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.json({ message: 'Error sending activation email' });
        } else {
          return res.json({ message: 'Activation email sent successfully' });
        }
      });
    }
  },

  activateAccount: async (req, res) => {
    try {
      const { activationToken } = req.params;
      const user = await User.findOne({ activationToken, activated: false });
      const admin = await Admin.findOne({ activationToken, activated: false });
      if (user) {
        user.activated = true;
        user.activationToken = null;  
        await user.save();  
        return res.json({ message: 'Account activated successfully' });
      }
      else if (admin) {
        admin.activated = true;
        admin.activationToken = null;
        await admin.save();
        return res.json({ message: 'Account activated successfully' });
      }
      else {
        return res.json({ message: 'Invalid activation token or account already activated' });
      }
    } catch (error) {
      console.error("Error activating account:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = usercontrollers;