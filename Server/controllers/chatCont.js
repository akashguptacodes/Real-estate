const Chat = require('../models/ChatSchema')
const Message  =require('../models/MessageSchema');
const User = require('../models/User');
const mongoose = require('mongoose')

exports.getChats = async (req,res) => {
 try{
    const tokenUserId = req.user.id;
    const chats = await Chat.find({
        users: tokenUserId,
    }).lean();
    for (const chat of chats) {
        const receiverId = chat.users.find((id) => id.toString() !== tokenUserId.toString());
    
        if (receiverId) {
            const receiver = await User.findById(receiverId).select({
                _id:true,
                userName:true,
                image:true
            });
            chat.receiver = receiver;
        }
    }
    
    if(chats){
        res.status(200).json({
            success:true,
            chats: chats,
            message:'Fetched all chats'
        });
    }

 }
 catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:"Error fetching chats"
    })
 }
}


exports.getChat = async (req,res) => {
    const tokenUserId = req.user.id;
    const chatId = req.params.id;
    try{
        const chat = await Chat.findOne({
            _id: chatId,
            users: tokenUserId
        }).populate({
            path: 'messages',
            options:{sort: {createdAt:1}},
        });
        if(!chat){
            return res.status(403).json({
                success:false,
                message: 'Chat not found'
            })
        }
        if(!chat.seenBy.includes(tokenUserId)){
            chat.seenBy.push(tokenUserId);
            await chat.save();
        }
        return res.status(200).json({
            success:true,
            message:'Fetched chat',
            chat: chat,
        })
    }
    catch(error){
       console.log(error);
       res.status(500).json({
           success:false,
           message:"Error fetching chat"
       })
    }
   }

   exports.checkChatExistance = async (req,res) => {
    const tokenUserId = req.user.id;
    const {receiverId} = req.params;
    console.log("hello");
    
    try{
        const chat = await Chat.findOne(
           { users: { $all: [tokenUserId, receiverId] } }
        )
        if(!chat){
            return res.status(200).json({
                success:false,
                message: 'Chat not found'
            })
        }
        return res.status(200).json({
            success:true,
            message:'Chat exists',
            chat: chat,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error checking chat existence"
        })
        
    }
   }



   exports.addChat = async (req,res) => {
    const tokenUserId = req.user.id;
    const { receiverId } = req.body;
    try{
        const newChat = await Chat.create({
            users: [tokenUserId, receiverId],
        })
        if(newChat){
            return res.status(200).json({
                success:true,
                message:'New chat created',
                data:newChat
            })
        }
    }
    catch(error){
       console.log(error);
       res.status(500).json({
           success:false,
           message:"Error fetching users"
       })
    }
   }



   exports.readChat = async (req, res) => {
    const tokenUserId = req.user.id;
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }
  
    try {
      const chat = await Chat.findOneAndUpdate(
        { _id: id, users: tokenUserId },
        { $addToSet: { seenBy: tokenUserId } },
        { new: true }
      );
  
      if (!chat) {
        return res.status(404).json({
            message: "Chat not found!"
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Chat read successfully",
        data: chat
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to read chat!" });
    }
  };
  