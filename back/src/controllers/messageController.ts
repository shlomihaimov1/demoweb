import { User } from "../models/user";
import Message from "../models/message";
import { getReceiverSocketId, io } from "../lib/socket";
import mongoose from "mongoose";

export const getUsersForSidebar = async (req: any, res: any) => {
  try {
    console.log("im at getUsersForSidebar ", req.user);
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error: any) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: any, res: any) => {
  try {
    const { id: userToChatId } = req.params;
    console.log("userToChatId: ", userToChatId);
    const myId = req.user._id;
    console.log("myId: ", myId);

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error: any) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req: any, res: any) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(receiverId) || !mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
