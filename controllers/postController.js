const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");

exports.getPosts = asyncHandler(async (req, res) => {
    try {
        const userFriends = req.user.friends.map(friend => friend._id);
        
        let allFriendPostIDs = []

        for (let i = 0; i < userFriends.length; i++) {
            const user = await User.findById(userFriends[i]._id)
            for (let i = 0; i < user.posts.length; i++) {
                allFriendPostIDs.push(user.posts[i])
            }
        }

        for (let j = 0; j < req.user.posts.length; j++) {
            allFriendPostIDs.push(req.user.posts[j])
        }

        const allFriendPosts = await Post.find({ _id: { $in: allFriendPostIDs }})
            .select('poster postContent likes comments dateSent')
            .populate('poster')
            .populate('image')
            .populate({path: 'comments', populate: { path: 'commenter' }})
            .sort({dateSent: -1})
            .exec()

        res.json(allFriendPosts)

    } catch (err) {
        res.json(err)
    }
})

exports.getPost = asyncHandler(async (req, res) => {
    try {
        let postId = req.params.postid;

        let post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Could not find this post" });
        }

        return res.json(post);
    } catch (err) {
        console.error("Error fetching post:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

exports.createPost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { postContent } = req.body;
    let imageUrl = null;

    try {
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path);
            imageUrl = imageUpload.secure_url;
        }

        const newPost = new Post({
            poster: userId,
            dateSent: new Date(),
            comments: [],
            likes: [],
            image: {
                url: imageUrl || ''
            },
            postContent: postContent || ''
        });

        await newPost.save();

        await updateUserWithPost(userId, newPost);

        return res.status(201).json({ success: true, message: "Post saved!", newPost });
    } catch (err) {
        console.error("Error creating post:", err);
        return res.status(500).json({ success: false, message: "Failed to create post", error: err.message });
    }
});

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

