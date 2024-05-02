const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs")
const User = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");

require('dotenv').config();

const jwt = require("jsonwebtoken");

exports.protected = asyncHandler(async (req, res) => {
    return res.json('protected')
})

exports.userSignUp = asyncHandler(async (req, res) => {
    if (req.body.password !== req.body.confirmedPassword) {
      return res.status(400).json({ error: 'Password and confirmed password do not match' });
    }
    if (req.body.password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err); 
    } 
    try {
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      });
      const result = await user.save();
      res.json(result);
    } catch(err) {
      return next(err);
    }
  });  
})

exports.userLogin = asyncHandler(async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(401).json({ success: false, msg: "Could not find user" });
      }
  
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(401).json({ success: false, msg: "Incorrect password" });
      }
  
      const opts = {};
      opts.expiresIn = 60 * 60 * 24;
      const secret = process.env.secret;
      const token = jwt.sign({ userId: user._id }, secret, opts);
  
      return res.status(200).json({
        success: true,
        message: "Authentication successful",
        token
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, msg: "Internal server error" });
    }
  });

exports.myProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id

  let myProfile = await User.findById(userId)

  if (!myProfile) {
    res.json("Could not find this user")
  }

  res.json(myProfile)
})

exports.updateUsername = asyncHandler(async (req, res) => {
  let userId = req.user._id

  let updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { username: req.body.username } },
    { new: true }
  )

  if (!updatedUser) {
    return res.json("Could not find this user")
  }

  return res.json({success: true, message: "Username updated successfully", updatedUser})
})

exports.updateBio = asyncHandler(async (req, res) => {
  let userId = req.user._id

  let updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { bio: req.body.bio } },
    { new: true }
  )

  if (!updatedUser) {
    return res.json("could not find this user")
  }

  return res.json({ success: true, message: "User bio updated successfully", updatedUser })
})

exports.updateProfilePicture = asyncHandler(async (req, res) => {
  let userId = req.user._id

  try {
    const imageUpload = await cloudinary.uploader.upload(req.file.path);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          profilePic: {
            public_id: imageUpload.public_id,
            url: imageUpload.secure_url,
          },
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

})

exports.getUser = asyncHandler(async (req, res) => {
  const userId = req.params.userid;

  let userProfile = await User.findById(userId)

  if (!userProfile) {
    res.json("Could not find this user")
  }

  res.json(userProfile)
})



exports.sendFriendRequest = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userid;

        const presentUser = await User.findById(req.user._id);

        for (let i = 0; i < presentUser.sentFriendRequests.length; i++) {
            if (presentUser.sentFriendRequests[i].toString() === userId) {
                return res.json("User already requested")
            }
        }

        for (let i = 0; i < presentUser.friends.length; i++) {
            if (presentUser.friends[i].toString() === userId) {
                return res.json("Already friends with this user")
            }
        }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { friendRequests: req.user._id } },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, msg: "Could not find user" });
      }
  
      console.log('Updated User:', updatedUser);
  
      const requestedUserId = updatedUser._id;
  
      const currentUser = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { sentFriendRequests: requestedUserId } },
        { new: true }
      );
  
      if (!currentUser) {
        return res.status(404).json({ success: false, msg: "Could not find current user" });
      }
  
      console.log('Updated Current User:', currentUser);
  
      res.status(200).json({ success: true, msg: "Friend request sent successfully" });
    } catch (err) {
      console.error('Error sending friend request:', err);
      res.status(500).json({ success: false, msg: "Internal server error" });
    }
  });

exports.acceptFriendRequest = asyncHandler(async (req, res) => {
    const userId = req.params.userid;

    const currentUser = await User.findByIdAndUpdate(
        req.user._id,
        { 
            $push: { friends: userId },
            $pull: { friendRequests: userId }
        },
        { new: true }
    )

    const acceptedUser = await User.findByIdAndUpdate(
        userId,
        { 
            $push: { friends: req.user._id },
            $pull: { sentFriendRequests: req.user._id } 
        },
        { new: true }
    )

    console.log(currentUser, "updated current user")
    console.log(acceptedUser, "updated accepted user")
    res.json("Friend request accepted")
})

exports.removeFriend = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id
  const exFriendId = req.params.userid

  const currentUser = await User.findByIdAndUpdate(
    currentUserId,
    { $pull: { friends: exFriendId } },
    { new: true }
  )

  if (!currentUser) {
    return res.json("Could not find current user")
  }

  const exFriend = await User.findByIdAndUpdate(
    exFriendId,
    { $pull: { friends: currentUserId } },
    { new: true }
  )

  if (!exFriend) {
    return res.json("Could not find friend to remove")
  }

  return res.json({ success: true, message: "Friend removed", currentUser })
})

exports.getFriends = asyncHandler(async (req, res) => {
    const userFriends = req.user.friends.map(friend => friend);

    const allFriends = await User.find({ _id: { $in: userFriends }})
            .select('username bio friends')
            .populate({
                path: 'friends', 
                  select: 'username' 
              })
              
            .exec()

    res.json(allFriends)
})

exports.friendRequests = asyncHandler(async (req, res) => {
    const friendRequests = req.user.friendRequests.map(request => request)

    const allFriendRequests = await User.find({ _id: { $in: friendRequests }})
    .select('username bio')
    .populate({
        path: 'friends', 
          select: 'username' 
      })
      
    .exec()

    res.json(allFriendRequests)
})

exports.sentFriendRequests = asyncHandler(async (req, res) => {
    const sentFriendRequests = req.user.sentFriendRequests.map(request => request)

    const allSentFriendRequests = await User.find({ _id: { $in: sentFriendRequests }})
    .select('username bio')
    .populate({
        path: 'friends', 
          select: 'username' 
      })
      
    .exec()

    res.json(allSentFriendRequests)
})

