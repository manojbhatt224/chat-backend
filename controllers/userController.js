import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js'

class UserController{
    static userRegistration=async (req, res)=>{
        const {firstname, lastname, password, email, password_confirmation, tc}=req.body
        const profileImage = req.file ? req.file.path : ""
        const user=await User.findOne({email:email})
        if(user){
            res.sendData(409, 'Email Already Exists');
        }
        else{
            if (firstname && lastname && email && password && password_confirmation && tc){
                if (password===password_confirmation){
                try {const salt= await bcrypt.genSalt(10)
                    const hashPassword=await bcrypt.hash(password, salt)
                    const doc=new User({firstname:firstname, lastname:lastname, email:email, password:hashPassword, tc:tc, profileImage: profileImage})
                    await doc.save();
                    const detail = {
                      _id: doc._id,
                      firstname: doc.firstname,
                      lastname: doc.lastname,
                      email: doc.email,
                      tc: doc.tc,
                      profileImage: doc.profileImage
                  };
                    res.sendData(200, 'Success',{'user': detail})}
                catch(error){
                    res.sendData(409, `${error}`)
                }
                }
                else{
                    res.sendData(400, 'Passwords didnt match')
                }
            }
            else{
                res.sendData(400, 'All fields are required')
            }
        }
    }

    static userLogin = async (req, res) => {
      const user=req.user;
        try {
          const { email, password } = req.body
          if (email && password) {
            const user = await User.findOne({ email: email })
            if (user != null) {
              const isMatch = await bcrypt.compare(password, user.password)
              if ((user.email === email) && isMatch) {
                            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                res.sendData(200, 'Success', {'token':token})
                // res.send({ "status": "success", "message": "Login Success", "token": token })
              } else {
                res.sendData(401, 'Email or Password is not valid.')
                // res.send({ "status": "failed", "message": "Email or Password is not Valid" })
              }
            } else {
                res.sendData(401, 'You are not a registered user.')
           
            //   res.send({ "status": "failed", "message": "You are not a Registered User" })
            }
          } else {
            res.sendData(401, 'All fields are required!')
            // res.send({ "status": "failed", "message": "All Fields are Required" })
          }
        } catch (error) {
          console.log(error)
          res.send({ "status": "failed", "message": "Unable to Login" })
        }
      }
    static loggedUser = async (req, res) => {
        res.sendData(200, "Valid User", {"user":req.user})
      }
    
    static changeUserPassword = async (req, res) => {
        const { password, password_confirmation } = req.body
        if (password && password_confirmation) {
          if (password !== password_confirmation) {
            res.sendData(401, "New Password and Confirm New Password doesn't match.")
          } else {
            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password, salt)
            await User.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
            res.sendData(200, "Password Changed Successfully")
          }
        } else {
          res.sendData(401, "All Fields are Required");
        }
      }
    
      static sendUserPasswordResetEmail = async (req, res) => {
        const { email } = req.body
        if (email) {
          const user = await User.findOne({ email: email })
          if (user) {
            const secret = user._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
            const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
            console.log(link)
            // Send Email
            let info = await transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: user.email,
              subject: "Manoj - Password Reset Link",
              html: `<a href=${link}>Click Here</a> to Reset Your Password`
            })
            res.sendData(200, "Password Reset Email Sent",{"Link":link})
          } else {
            res.sendData(401, "Email Doesn't Exist")
            // res.send({ "status": "failed", "message": "Email doesn't exists" })
          }
        } else {
          res.sendData(401, "Email Field is Required!")
          // res.send({ "status": "failed", "message": "Email Field is Required" })
        }
      }
      static userPasswordReset = async (req, res) => {
        const { password, password_confirmation } = req.body
        const { id, token } = req.params
        const user = await User.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try {
          jwt.verify(token, new_secret)
          if (password && password_confirmation) {
            if (password !== password_confirmation) {
              res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
            } else {
              const salt = await bcrypt.genSalt(10)
              const newHashPassword = await bcrypt.hash(password, salt)
              await User.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
              res.send({ "status": "success", "message": "Password Reset Successfully" })
            }
          } else {
            res.send({ "status": "failed", "message": "All Fields are Required" })
          }
        } catch (error) {
          console.log(error)
          res.send({ "status": "failed", "message": "Invalid Token" })
        }
      }
    static userTest=async (req, res)=>{
            res.sendData(200, 'Welcome to the API!', { info: 'This is a test API' });
    
    }
    static allUsers=async(req, res)=>{
      const keyword=req.query.search?{
        $or :[
          {firstname:{$regex: req.query.search, $options:"i"}},
          {lastname:{$regex: req.query.search, $options:"i"}},
          {email:{$regex:req.query.search, $options:"i"}},
        ]
      }:{};
      const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
      res.sendData(200,"Success", {'users':users})
    }
}

export default UserController