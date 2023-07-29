const express = require('express')
const router = express.Router();

//controller for options
const optionController = require('../../controllers/optionController')

// to createv an option
router.post('/create',optionController.create);
// to delete an option
router.get('/delete',optionController.delete);
// to add a vote to an option
router.get('/add_vote',optionController.addVote);

module.exports = router