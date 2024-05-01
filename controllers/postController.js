const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.createPost = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const newPost = new Post({
        poster: userId,
        postContent: req.body.postContent,
        comments: [],
        likes: 0
    })
        await newPost.save()

        await updateUserWithPost(userId, newPost)

        return res.json({ success: true, message: "Post saved!", newPost });
    } catch (err) {
        res.json(err)
    }
})

async function updateUserWithPost(userId, post) {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { posts: post }},
        { new: true }
    )

    if (updatedUser) {
        console.log('Updated user document:', updatedUser);
    } else {
        console.log('No user document found with the specified ID.');
    }

    return updatedUser;
}

