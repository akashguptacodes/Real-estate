const express = require('express');
const { getUsers, getUser, updateUser, deleteUser, changePassword, getNotificationNumber, savePost} = require('../controllers/userCont');
const {auth} = require('../middlewares/Auth')
const router = express.Router();

router.get('/getUsers', getUsers);
router.get('/getUser/:id', auth, getUser);
router.put('/updateUser/:id', auth, updateUser);
router.put('/updateUser/changepassword/:id', auth, changePassword);
router.delete('/deleteUsers/:id', auth, deleteUser);
router.post('/savepost/:postId', auth, savePost);
router.get('/notification', auth, getNotificationNumber);

module.exports = router;