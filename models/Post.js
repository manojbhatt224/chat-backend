import mongoose from "mongoose";
import User from '../models/User.js';

const {Schema}=mongoose
const postSchema = mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref:'User', required: true},
    desc: {type: String, required : true},
    likes: {type: [mongoose.Schema.Types.ObjectId], default:[]},
    image: {type:String}
  },
  {
    timestamps: true,
  }
);

var Post = mongoose.model("Posts", postSchema);

export default Post;
