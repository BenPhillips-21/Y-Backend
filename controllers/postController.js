const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.getPosts = asyncHandler(async (req, res) => {
    try {
        const userFriends = req.user.friends.map(friend => friend._id);
        console.log(userFriends)
        
        let allFriendPostIDs = []

        for (let i = 0; i < userFriends.length; i++) {
            const user = await User.findById(userFriends[i]._id)
            for (let i = 0; i < user.posts.length; i++) {
                allFriendPostIDs.push(user.posts[i])
            }
        }

        const allFriendPosts = await Post.find({ _id: { $in: allFriendPostIDs }})
            .select('poster postContent likes comments')
            .exec()

        res.json(allFriendPosts)

    } catch (err) {
        res.json(err)
    }
})

exports.createPost = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const newPost = new Post({
        poster: userId,
        postContent: req.body.postContent,
        comments: [],
        likes: []
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

exports.deletePost = asyncHandler(async (req, res) => {
    let postId = req.params.postid

    try {
        if (req.user.admin === false) {
            const postToDelete = await Post.findById(postId)

            if (postToDelete.poster.toString() !== req.user._id.toString()) {
                return res.json("You can't delete this post")
            }
        }

        const deletedPost = await Post.findByIdAndDelete(postId)

        if (!deletedPost) {
            return { success: false, msg: "Post not found" };
        }

        return res.json({ success: true, msg: "Post deleted successfully" })
    } catch (err) {
        res.json(err)
    }
})

exports.likePost = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const postId = req.params.postid

    try {
        const postToUpdate = await Post.findById(postId)

        if (postToUpdate.likes.length > 0) {
        for (let i = 0; i < postToUpdate.likes.length; i++) {
            if (postToUpdate.likes[i].toString() === userId.toString()) {
                await Post.findByIdAndUpdate(
                    postId,
                    { $pull: { likes: userId } },
                    { new: true }
                )

                return res.json({ success: true, msg: "Post like retracted" })
            }
        }}

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { likes: userId } },
            { new: true }
        )

        if (!updatedPost) {
            return res.json("Couldn't find post with specified id")
        }
        
        return res.json({ success: true, msg: "Post liked successfully" })
    } catch (err) {
        return res.json(err)
    }
})

