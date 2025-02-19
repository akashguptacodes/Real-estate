const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    lastMessage: {
        type: String
    },
  });
  
module.exports = mongoose.model('Chat', ChatSchema);