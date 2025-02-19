
const express = require('express')
const { addMessage } = require('../controllers/messageCont');
const {auth} = require('../middlewares/Auth');

const router = express.Router();

router.post('/addmessage/:chatId', auth, addMessage);
module.exports = router;