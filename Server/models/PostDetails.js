const mongoose = require('mongoose');

const postDetailsSchema = new mongoose.Schema({
    description: {
        type: String,
        // required:true,
    },
    utilities: {
        type: String,
        required:true,
    },
    pet: {
        type: String,
        required:true,
    },
    income: {
        type: String,
        required:true,
    },
    size: {
        type: Number,
        required:true,
    },
    school: {
        type: Number,
        required:true,
    },
    bus: {
        type: Number,
        required:true,
    },
    restaurant: {
        type: Number,
        required:true,
    },
});

module.exports = mongoose.model("PostDetails", postDetailsSchema)