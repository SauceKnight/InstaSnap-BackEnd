// This should be POST /users/:user_id/ or POST /users/:user_id/token
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { check } = require("express-validator");

const { User, Post } = require('../db/models');
const { asyncHandler, handleValidationErrors } = require('../utils');
const { getUserToken, requireAuth } = require('../auth');

const validateEmailAndPassword = [
    check('email')
        .exists({ checkFalsy: true })
        .withMessage('Please enter an email.')
        .isEmail()
        .withMessage('Please enter a valid email.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please give a password.'),
    handleValidationErrors
];

const validateUserNameAndPassword = [
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please give a password.'),
    handleValidationErrors
];

const validateUsername = [
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a username."),
]


router.get('/user/:user_id', asyncHandler(async (req, res, next) => {
    const userID = parseInt(req.params.user_id, 10);
    const user = await User.findByPk(userID);

    res.json({ user });
}));

router.post('/users', validateUsername, validateEmailAndPassword, asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePic = 'https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_960_720.jpg'
    const user = await User.create({ userName: username, userEmail: email, hashedPassword, profilePic: profilePic });
    const token = getUserToken(user);
    res.status(201).json({ token, user: { id: user.id, name: user.userName } });
}));

router.get('/profile/:userName', asyncHandler(async (req, res, next) => {

    const user = req.params.userName;
    const userProfile = await User.findOne({ include: Post, order: [['createdAt', 'DESC']], where: { userName: user } });

    res.json({ userProfile });
}));

// Log-in
router.post('/users/token', validateUserNameAndPassword, handleValidationErrors, asyncHandler(async (req, res, next) => {
    // Get values from form:
    const { username, password } = req.body;

    // Find user with username:
    const user = await User.findOne({ where: { userName: username } });

    // If user is not found or password does not match, make new error object:
    if (!user || !user.validatePassword(password)) {
        const err = new Error("Login failed");
        err.status = 401;
        err.title = "Login failed";
        err.errors = ["The provided credentials were invalid."];

        return next(err);
    }

    // Generate JWT token and send JSON response with token and user ID
    const token = getUserToken(user);
    res.json({ token, user: { id: user.id, name: user.userName }, });
}));





module.exports = router;