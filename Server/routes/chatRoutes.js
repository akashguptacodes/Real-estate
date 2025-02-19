const express = require('express')
const { getChats, getChat, addChat, readChat, checkChatExistance } = require('../controllers/chatCont')
const {auth} = require('../middlewares/Auth');
const router = express.Router()

router.get('/getchats', auth, getChats);
router.get('/getchat/:id', auth, getChat);
router.get('/checkchatexistance/:receiverId', auth, checkChatExistance);
router.post('/addchat',auth,addChat);
router.put('/readchat/:id',auth,readChat);

module.exports = router;