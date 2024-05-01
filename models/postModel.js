const mongoose = require('mongoose');

const Schema = mongoose.Schema

const PostSchema = new Schema({
    poster: {type: Schema.Types.ObjectId, ref: "User"},
    postContent: {type: String, required: true},
    likes: {type: Number, required: true, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
});

module.exports = mongoose.model("Post", PostSchema);