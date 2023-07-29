const express = require('express')
const router = express.Router();

// question controller
const questionController = require('../../controllers/questionController')

// redirecting to options route
router.use('/questions/options',require('./option'));

// to create a question
router.post('/questions/create',questionController.create);
// to display a question
router.get('/questions/',questionController.display);
// to delete a question
router.get('/questions/delete',questionController.delete);

module.exports = router