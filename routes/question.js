const express = require('express')
const router = express.Router();

const questionController = require('../controllers/questionController')

router.use('/questions/options',require('./optons'));

router.post('/questions/create',questionController.create);
router.get('/questions/',questionController.display);

router.get('/questions/delete',questionController.delete);

module.exports = router