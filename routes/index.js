var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/userController')
const post_controller = require('../controllers/postController')
const comment_controller = require('../controllers/commentController')

const passport = require("passport");
const jwtStrategy = require("../strategies/jwt")

passport.use(jwtStrategy);

const upload = require("../middleware/multer");

router.post('/sign-up', user_controller.userSignUp)

router.post('/login', user_controller.userLogin)

router.get('/myprofile', passport.authenticate('jwt', {session: false}), user_controller.myProfile)

router.post('/updateusername', passport.authenticate('jwt', {session: false}), user_controller.updateUsername)

router.post('/updatebio', passport.authenticate('jwt', {session: false}), user_controller.updateBio)

router.post('/updateprofilepicture', passport.authenticate('jwt', {session: false}), upload.single('image'), user_controller.updateProfilePicture)

router.get('/getuser/:userid', passport.authenticate('jwt', {session: false}), user_controller.getUser)

router.get('/myfriends', passport.authenticate('jwt', {session: false}), user_controller.getFriends)

router.get('/friendrequests', passport.authenticate('jwt', {session: false}), user_controller.friendRequests)

router.get('/sentfriendrequests', passport.authenticate('jwt', {session: false}), user_controller.sentFriendRequests)

router.get('/sendfriendrequest/:userid', passport.authenticate('jwt', {session: false}), user_controller.sendFriendRequest)

router.get('/acceptfriendrequest/:userid', passport.authenticate('jwt', {session: false}), user_controller.acceptFriendRequest)

router.post('/createpost', passport.authenticate('jwt', {session: false}), post_controller.createPost)

router.get('/getposts', passport.authenticate('jwt', {session: false}), post_controller.getPosts)

router.get('/likepost/:postid', passport.authenticate('jwt', {session: false}), post_controller.likePost)

router.get('/deletepost/:postid', passport.authenticate('jwt', {session: false}), post_controller.deletePost)

router.post('/postcomment/:postid', passport.authenticate('jwt', {session: false}), comment_controller.postComment)

router.post('/deletecomment/:postid/:commentid', passport.authenticate('jwt', {session: false}), comment_controller.deleteComment)

module.exports = router;
