import Conversation from "../models/conversationSchema.js";
import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    //SOCKET IO FUNCTIONALITY

    //await conversation.save();  fist this,may takes time
    //await newMessage.save();    then this,need to wait

    //this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage ", error.message);
    res.status(500).json({ error: "Internal Server  Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatID } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatID] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages= conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage", error.message);
    res.status(500).json({ error: "Internal Server  Error" });
  }
};
