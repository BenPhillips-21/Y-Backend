var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/userController')
const post_controller = require('../controllers/postController')
const comment_controller = require('../controllers/commentController')

const passport = require("passport");
const jwtStrategy = require("../strategies/jwt")

passport.use(jwtStrategy);

router.post('/sign-up', user_controller.userSignUp)

router.post('/login', user_controller.userLogin)

router.get('/myfriends', passport.authenticate('jwt', {session: false}), user_controller.getFriends)

router.get('/friendrequests', passport.authenticate('jwt', {session: false}), user_controller.friendRequests)

router.get('/sentfriendrequests', passport.authenticate('jwt', {session: false}), user_controller.sentFriendRequests)

router.get('/sendfriendrequest/:userId', passport.authenticate('jwt', {session: false}), user_controller.sendFriendRequest)

router.get('/acceptfriendrequest/:userId', passport.authenticate('jwt', {session: false}), user_controller.acceptFriendRequest)

router.post('/createpost', passport.authenticate('jwt', {session: false}), post_controller.createPost)

router.get('/getposts', passport.authenticate('jwt', {session: false}), post_controller.getPosts)

module.exports = router;
