const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postId: {
        type: String,
    },
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    images: {
        type: [String],
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    bedroom: {
        type: Number,
    },
    bathroom: {
        type: String,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    Type: {
        type: String,
        required: true,
        enum: ["buy","rent"]
    },
    Property: {
        type: String,
        required: true,
        enum: ["apartment","house","condo","land"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    postDetails:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "PostDetails"
    },
    savedPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "SavedPosts"

    }]
})

module.exports = mongoose.model('Post',postSchema)