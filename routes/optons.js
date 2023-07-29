const express = require('express')
const router = express.Router();

const optionController = require('../controllers/optionController')

router.post('/create',optionController.create);
router.get('/delete',optionController.delete);
router.get('/add_vote',optionController.addVote);

module.exports = router