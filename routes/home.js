const express = require('express')
const router = express.Router();


router.use('/',require('./api/question'));

module.exports = router