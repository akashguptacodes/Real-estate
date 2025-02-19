const Chat = require("../models/ChatSchema");
const  Message = require("../models/MessageSchema");
const mongoose = require('mongoose')

exports.addMessage = async (req, res) => {
    const tokenUserId = req.user.id;
    const { chatId } = req.params;
    const { inptext } = req.body;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
    }

    try {
        const chat = await Chat.findOne({ _id: chatId, users: tokenUserId });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        const message = new Message({
            text:inptext,
            chat: chatId,
            userId: tokenUserId,
        });
        await message.save();

        await Chat.findByIdAndUpdate(chatId, {
            seenBy: [tokenUserId],
            lastMessage: inptext,
            $push: { messages: message._id },
        });

        res.status(200).json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add message!" });
    }
};
