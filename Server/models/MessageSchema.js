const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
  });

module.exports = mongoose.model('Message', MessageSchema)