const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");



router.post("/",async(req , res) =>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);

    }catch(err){
        res.status(500).json(err);

    }

});
// Update User Id
router.put("/:id",async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set : req.body});
            res.status("200").json("the post is updated");

        }else{
            res.status(403).json("you can update only your profile");
        }

    }catch(err){
        res.status(500).json(err);

    }

});

//Delete User Id

router.delete("/:id",async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status("200").json("the post has been deleted");

        }else{
            res.status(403).json("you can delete only your post");
        }

    }catch(err){
        res.status(500).json(err);

    }

});

//Like and DisLike the post

router.put("/:id/like",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({ $push : {likes : req.body.userId}});
            res.status(200).json("the post has been like");
        }else{
            await post.updateOne({ $pull : {likes : req.body.userId}});
            res.status(200).json("the post has been dislike");
         }

    }catch(err){
        res.status(500).json(err);

    }
});

// get the post 

router.get("/:id" , async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);

    }catch(err){
        res.status(500).json(err);

    }
    
})


 router.get("/timeline/all" , async (req,res)=>{
    
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId : currentUser._id});
        const friendPosts  = await Promise.all(
        currentUser.following.map((frienId)=>{
               return Post.find({userId : frienId})
            })
        );
        res.json(userPosts.concat(...friendPosts));

    }catch(err){
        res.status(500).json(err);
    }
 })

module.exports = router;