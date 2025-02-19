const express = require('express');
const router = express.Router();
const {auth} = require('../middlewares/Auth');
const { getPosts, getPost, addPost,updatePost, deletePost, Getprofileposts, getSavedPosts } = require('../controllers/postCont');

router.post('/getposts', getPosts)
router.get('/getpost/:id', getPost)
router.get('/getprofileposts/:id', auth,Getprofileposts)
router.get('/getsavedposts', auth,getSavedPosts)
router.post('/addpost', auth,addPost)
router.put('/updatepost/:id', auth,updatePost)
router.delete('/deletepost/:id', auth,deletePost)


module.exports = router;