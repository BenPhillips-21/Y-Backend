const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs")
const User = require("../models/userModel");

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

// Needs to check if the userId is already in friendRequests box
exports.sendFriendRequest = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;

        const presentUser = await User.findById(req.user._id);

        for (let i = 0; i < presentUser.sentFriendRequests.length; i++) {
            if (presentUser.sentFriendRequests[i].toString() === userId) {
                return res.json("User already requested")
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
    const userId = req.params.userId;

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