const express = require('express');
const router = express.Router();
const usersRouter = require('./users.js'); // Make sure to include the file extension

router.use('/users', usersRouter);

module.exports = router;