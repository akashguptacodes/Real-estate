const PostDetails = require("../models/PostDetails");
const Posts = require("../models/Posts");
const User = require("../models/User");
const { uploadFileToCloudinary } = require("../utils/imageUploader");
const jwt = require('jsonwebtoken')
const SavedPost = require('../models/SavePostSchema')


exports.getPosts = async (req, res) => {
    const { city, type, property, minPrice, maxPrice, bedroom } = req.body;
    console.log(req.body);
    

    try {
        const query = {
            // Type: type,
            ...(type && type !== "" ? { Type: type } : {}),
            ...(city ? { city: city } : {}),
            ...(property ? { Property: property } : {}),
            ...(minPrice || maxPrice
                ? {
                      price: {
                          ...(minPrice ? { $gte: parseInt(minPrice) } : {}),
                          ...(maxPrice ? { $lte: parseInt(maxPrice) } : {}),
                      },
                  }
                : {}),
            ...(bedroom ? { bedroom: { $gte: parseInt(bedroom) } } : {}),
        };
        
        console.log({query}); // Log the query to debug
        const posts = await Posts.find(query);

        if (posts.length === 0) {
            console.log("No posts found");
            return res.status(201).json({
                success:true,
                message: "No posts found",
                posts:[]
            })
        }
        else {
            return res.status(200).json({
                success: true,
                message: "Posts fetched successfully",
                posts: posts,
            });
        }
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




exports.getPost = async (req,res) => {
    const {id} = req.params;
    // const id = req.params.id;   both will work
    try{
        const post = await Posts.findById(id)
                                    .populate('postDetails')
                                    .populate({
                                        path:'user',
                                        select:'userName image'
                                    })
                                    .exec();
        const token = req.cookies?.tokenCookie;
        if(token){
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decode.id;
            const saved = await SavedPost.findOne({userId:userId,postId:id});
            return res.status(200).json({
                success:true,
                post:{...post,isSaved: saved?true:false},
                saved:true
            })
        }
        res.status(200).json({
            success:true,
            message:"fetched post",
            post:{...post, isSaved: false}
        });
    }
    catch(error){
        console.log(error);
        
        return res.status(500).json({
            success:false,
            message: 'Error while fetching post'
        })
    }
}


exports.addPost = async (req, res) => {
    const {
      postId,
      title,
      price,
      address,
      city,
      bedroom,
      bathroom,
      latitude,
      longitude,
      Type,
      Property,
    } = req.body;
  
    // Reconstruct `postDetails` object
    const postDetails = {
      description: req.body['postDetails[description]'],
      utilities: req.body['postDetails[utilities]'],
      pet: req.body['postDetails[pet]'],
      income: parseInt(req.body['postDetails[income]']),
      size: parseInt(req.body['postDetails[size]']),
      school: parseInt(req.body['postDetails[school]']),
      bus: parseInt(req.body['postDetails[bus]']),
      restaurant: parseInt(req.body['postDetails[restaurant]']),
    };
  
    console.log("Reconstructed postDetails:", postDetails);
  
    const tokenUserId = req.user.id;
  
    try {
      let imageUrls = [];
      let uploadRes;
  
      console.log(req.files);
  
      // Check if `req.files` contains an `images` key
      if (req.files && Array.isArray(req.files.images)) {
        for (const file of req.files.images) {
          // Upload each file to Cloudinary
          uploadRes = await uploadFileToCloudinary(file, process.env.FOLDER_NAME);
          imageUrls.push(uploadRes.secure_url);
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "No images found in the request",
        });
      }
  
      // Create post details
      const newPostDetails = await PostDetails.create({
        description: postDetails.description,
        utilities: postDetails.utilities,
        pet: postDetails.pet,
        income: postDetails.income,
        size: postDetails.size,
        school: postDetails.school,
        bus: postDetails.bus,
        restaurant: postDetails.restaurant,
      });
  
      // Create post
      const newPost = await Posts.create({
        postId,
        title,
        price,
        images: imageUrls,
        address,
        city,
        bedroom,
        bathroom,
        latitude,
        longitude,
        Type,
        Property,
        user: tokenUserId,
        postDetails: newPostDetails._id,
      });
  
      // Update user with new post
      await User.findByIdAndUpdate(
        { _id: tokenUserId },
        { $push: { posts: newPost._id } },
        { new: true }
      );
  
      if (newPost) {
        return res.status(200).json({
          success: true,
          message: "Post created successfully",
          data: newPost,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  

  



exports.updatePost = async (req,res) => {
    const {
        title,
        price,
        images,
        address,
        city,
        bedroom,
        bathroom,
        latitude,
        longitude,
        Type,
        Property} = req.body;
    const tokenUserId = req.id;
    try{
        const newPost = await Posts.create({
            postId:postId,
            title:title,
            price:price,
            images:images,
            address:address,
            city:city,
            bedroom:bedroom,
            bathroom:bathroom,
            latitude:latitude,
            longitude:longitude,
            createdAt,
            Type:Type,
            Property:Property,
            user:tokenUserId,
        })
        if(newPost){
            return res.status(200).json({
                success: true,
                message: 'Post created successfully',
                data: newPost
            })
        }
    }
    catch(error){
        console.log(error);
        
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.deletePost = async (req,res) => {
    const id = req.params.id;
    const tokenUserId = req.user.id;
    try{
        const post = await Posts.findById(id);

        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }
        if(post.user.toString() !== tokenUserId){
            return res.status(403).json({
                success:false,
                message: 'You are not the owner of this post'
            })
        }
        const deletedPost = await Posts.findByIdAndDelete(id)
        const user = await User.findByIdAndUpdate(
            {_id: tokenUserId},
            {$pull: {posts: deletedPost._id}},
            {new:true}
        )
        const deletepostDetails = await PostDetails.findByIdAndDelete(deletedPost?.postDetails._id)
        if(deletedPost){
            return res.status(200).json({
                success: true,
                message: 'Post deleted successfully',
                data: deletedPost
            })
        }
    }
    catch(error){
        console.log(error);
        
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}


exports.Getprofileposts = async (req,res) => {
    const {id} = req.params;
    try{
        if(!id){
            return res.json({
                success:false,
                message:"Id is required"
            })
         }
         const posts = await Posts.find({
            user:id
         });
         if(!posts){
            return res.json({
                success: false,
                message: 'No posts found'
            })
         }
         return res.status(200).json({
            success: true,
            message:"Fetched profile posts",
            posts: posts
         })
    }
    catch(error){
        console.log("Error while fetching profile posts",error);
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }

}

exports.getSavedPosts = async (req,res) => {
    const userId = req.user.id;
    try{
        const savedPosts = await SavedPost.find({userId: userId})
                                            .populate(
                                                {
                                                    path: 'postId',
                                                    populate:{
                                                        path: 'postDetails',
                                                    }
                                                }
                                            ).exec();
        if(!savedPosts){
            return res.json({
                success: false,
                message: 'No saved posts found'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Fetched saved posts',
            savedPosts: savedPosts
        })
    }
    catch(error){
        console.log("Error while fetching saved posts",error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}