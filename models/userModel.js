const mongoose = require('mongoose');

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    bio: {type: String, required: false, default: "This is the default bio"},
    profilePic: { 
        public_id: {
            type: String,
            default: "fh14w5zwu4oyhvcs2adw",
          },
          url: {
            type: String,
            default: "https://res.cloudinary.com/dlsdasrfa/image/upload/v1713316628/fh14w5zwu4oyhvcs2adw.png",
          },
        },
    friends: [{type: Schema.Types.ObjectId, ref: "User"}],
    friendRequests: [{type: Schema.Types.ObjectId, ref: "User"}],
    sentFriendRequests: [{type: Schema.Types.ObjectId, ref: "User"}],
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}],
    admin: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);