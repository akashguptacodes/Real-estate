const User = require('../models/User');
const bcrypt = require('bcrypt');
const { uploadFileToCloudinary } = require('../utils/imageUploader');
const Chat = require('../models/ChatSchema');
const SavedPost = require('../models/SavePostSchema');
const Posts = require('../models/Posts');


exports.getUsers = async (req, res) => {
    try{
        const Users = await User.find({});
        return res.status(200).json({
            status: true,
            message: 'Fetched all users',
            data: Users,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: 'Failed to get all users'
        })
    }
}


exports.getUser = async (req, res) => {    
    const id = req.params.id;
    try{
        const user = await User.findById({_id: id});

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }

        return res.status(200).json({
            status: true,
            message: 'Fetched user',
            data: user,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: 'Failed to get user details'
        })
    }
}


exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
  
    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own account",
      });
    }
  
    const { firstName, lastName, userName } = req.body;
  
    try {
      let updatedImageUrl;
  
      if (req.files && req.files.file) {
        const file = req.files.file;
  
        // Upload the file to Cloudinary or other storage
        const upload = await uploadFileToCloudinary(file, process.env.FOLDER_NAME);
        updatedImageUrl = upload.secure_url; // Get the file URL
      }
  
      // Update user data in the database
      const updatedUser = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            firstName,
            lastName,
            userName,
            ...(updatedImageUrl && { image: updatedImageUrl }), // Update image if uploaded
          },
        },
        { new: true }
      );
  
      updatedUser.password = undefined; // Exclude password from the response
  
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }
  };
  

exports.changePassword = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    const {oldpassword, newpassword} = req.body;

    try{
        if(id!==userId){
            return res.status(403).json({
                success: false,
                message: 'You can only change your own password',
            })
        }
        const user = await User.findById(userId);
        if(!await bcrypt.compare(oldpassword, user.password)){
            return res.status(401).json({
                success: false,
                message: 'Old password is incorrect',
            })
        }
        else{
            const hashedPassword = await bcrypt.hash(newpassword,10);
            const updatedUser = await User.findByIdAndUpdate(
                                                    {_id: userId},
                                                    {$set: {
                                                        password: hashedPassword
                                                    }},
                                                    {new:true}
            )
        }
        return res.status(200).json({
            status: true,
            message: 'Password updated',
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while changing password'
        })
    }
}


exports.deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
        const userId = req.user.id;

        if(id!==userId){
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own account',
            })
        }

        const deleteUser = await User.findByIdAndDelete({_id:id});
        if(deleteUser){
            return res.status(200).json({
                status: true,
                message: 'User deleted successfully',
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: 'Failed to delete users'
        })
    }
}

exports.getNotificationNumber = async (req, res) => {
    const tokenUserId = req.user.id;
    
    try {
      const number = await Chat.countDocuments({
        users: tokenUserId,
        seenBy: { $ne: tokenUserId },
      });
      
      res.status(200).json(number);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to get notification count!" });
    }
  };


  exports.savePost = async (req, res) => {
    const {postId} = req.params;
    const tokenUserId = req.user.id;
    console.log(postId);
    
    try {
        const checkSavedPost = await SavedPost.findOne({
            userId:tokenUserId,
            postId:postId
        });
        if(checkSavedPost){
            await SavedPost.findByIdAndDelete({_id: checkSavedPost._id});
            await User.findByIdAndUpdate(
                {_id:tokenUserId},
                {$pull:{
                    savedPosts: postId
                }}
            )
            await Posts.findByIdAndUpdate(
                {_id:postId},
                {$pull:{
                    savedPosts: postId
                }}
            )
            return res.status(200).json({
                success:true,
                message:'Post removed from save list',
            })
        };
        const savePost = await SavedPost.create({
            userId:tokenUserId,
            postId:postId
        });
        await User.findByIdAndUpdate(
            {_id:tokenUserId},
            {$push:{
                savedPosts: postId
            }}
        )
        await Posts.findByIdAndUpdate(
            {_id:postId},
            {$push:{
                savedPosts: postId
            }}
        )

      res.status(200).json({
        success: true,
        message: 'Post saved successfully',
        savedpost: savePost,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save post" });
    }
  };