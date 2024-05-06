const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel")

exports.postComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postid
    let date = Date.now()
    try {
        const newComment = new Comment({
            commenter: userId,
            commentContent: req.body.commentContent,
            dateSent: date
        })

        await newComment.save()

        await updatePostWithComment(postId, newComment)

        return res.json({ success: true, message: "Comment saved!", newComment });
    } catch (err) {
        return res.json(err)
    }
})

exports.deleteComment = asyncHandler(async (req, res) => {
    let commentId = req.params.commentid
    let postId = req.params.postid

    try {
        const commentToDelete = await Comment.findById(commentId)

        if (commentToDelete.commenter.toString() !== req.user._id.toString()) {
            return res.json("You can't delete this comment")
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId)

        if (!deletedComment) {
            return { success: false, msg: "comment not found" };
          }

        await Post.findByIdAndUpdate(
        postId, 
        { $pull: { comments: commentId } },
        { new: true }
        )

        return res.json({ success: true, msg: "comment deleted successfully" })
    } catch (err) {
        res.json(err)
    }
})

async function updatePostWithComment(postId, comment) {
    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment }},
        { new: true }
    )

    if (updatedPost) {
        console.log('Updated post document:', updatedPost);
    } else {
        console.log('No post document found with the specified ID.');
    }

    return updatedPost;
}