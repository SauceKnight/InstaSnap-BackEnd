const express = require('express');

const { Post, User } = require('../db/models');
const { asyncHandler } = require('../utils');

const router = express.Router();


router.get('/posts', asyncHandler(async (req, res, next) => {
    const posts = await Post.findAll({ include: User });

    res.json({ posts });
}));

router.post('/user/upload', asyncHandler(async (req, res, next) => {
    // const channelId = parseInt(req.params.channel_id, 10);
    const { image, caption, userID } = req.body;

    const post = await Post.create({ image, caption, userID });
    res.json({ post });
}))

module.exports = router;