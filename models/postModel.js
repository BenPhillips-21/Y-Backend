const mongoose = require('mongoose');

const Schema = mongoose.Schema

const PostSchema = new Schema({
    poster: {type: Schema.Types.ObjectId, ref: "User"},
    postContent: {type: String},
    dateSent: {type: Date, required: true},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    image: { 
          url: {
            type: String,
            default: "",
          },
        },
});

module.exports = mongoose.model("Post", PostSchema);