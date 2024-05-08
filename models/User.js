import mongoose from 'mongoose';


//schema-defines structure of model 
const userSchema= new mongoose.Schema({
 firstname:{type:String, required: true, trim:true},
 lastname:{type:String, required: true, trim:true},
 email:{type:String, required:true, trim:true},
 password:{type:String, required:true, trim:true},
 tc: {type:Boolean, required:true},
 profileImage: { type: String, default: "../uploads/profilepic/1714355936891.jpg" },  // Path to the stored image
 coverPicture: {type: String,default: "../uploads/profilepic/1714355936891.jpg" },
 about: String,
 livesIn: String,
 worksAt: String, 
 relationship: String,
 country: String,
 followers: [],
 following: [],
},
{
    timestamps:true
}
)

// Model
const User=mongoose.model("User", userSchema)
export default User