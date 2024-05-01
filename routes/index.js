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

module.exports = router;
