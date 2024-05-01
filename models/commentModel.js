const mongoose = require('mongoose');

const Schema = mongoose.Schema

const CommentSchema = new Schema({
    commenter: {type: Schema.Types.ObjectId, ref: "User"},
    commentContent: {type: String, required: true},
    post: {type: Schema.Types.ObjectId, ref: "Post"}
});

module.exports = mongoose.model("Comment", CommentSchema);