import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";

class PostController{
// creating a post

static createPost = async (req, res) => {
  console.log("create post")
  const userId=req.user._id;
  const {desc}=req.body
  const doc=new Post({userId:userId, desc:desc})
  await doc.save();
  res.sendData(200, "Success",{post:doc})

};

// get a post

static getPost = async (req, res) => {

res.sendData(200,"Success", {data:"no data"})
// res.status(200).json({msg:"success"})
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    res.sendData(200,"Success",{post:post})
  } catch (error) {
    res.sendData(200,"Fail",{error:error})
  }

};

// update post
static updatePost = async (req, res) => {
  const postId = req.params.id;
  const userId  = req.user._id;
  const {desc} = req.body;
  try {
    const post = await Post.findOne({ _id: postId, userId: userId });
    if (!post) {
      res.sendData(404, "Post not found or user not authorized to update this post");
    }
    //updation
    post.desc=desc
        // Save the updated post
        await post.save();
      res.sendData(200,"Post Updated!")
    
  } catch (error) {
    res.sendData(403, "Failure", {error:error})
  }
};

// delete a post
static deletePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.sendData(200, "Post Deleted")
    } else {
      res.sendData(403,"Action forbidden")
    }
  } catch (error) {
    res.sendData(500,"Fail",{error:error})
    res.status(500).json(error);
  }
};

// like/dislike a post
static likePost = async (req, res) => {
  const id = req.params.id;
  console.log(req.user)
  const userId  = req.user._id;
  console.log("User ID", userId)
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.sendData(404, "Post not found");
    }
    if (post.likes.includes(userId)) {
      const updatedPost = await Post.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true });
      // await post.updateOne({ $pull: { likes: userId } });
      res.sendData(200,"Post Disliked", { likesCount: updatedPost.likes.length })
    } else {
      const updatedPost = await Post.findByIdAndUpdate(id, { $push: { likes: userId } }, { new: true });
      // await post.updateOne({ $push: { likes: userId } });
      res.sendData(200,"Post Liked",{ likesCount: updatedPost.likes.length })
    }
  } catch (error) {
    res.sendData(500,"Failure", {error:error})
  }
};

// Get timeline posts
static getTimelinePosts = async (req, res) => {
  const userId = req.params.id
  try {
    const currentUserPosts = await Post.find({ userId: userId });

    const followingPosts = await User.aggregate([
      { 
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
}
export default PostController

