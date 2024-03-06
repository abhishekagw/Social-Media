import User from "../models/userModel.js";

export const getUsersView = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // uses to find all users,except the current logged user,id not equal to loggedin user
    res.status(200).json(allUsers)
  } catch (error) {
    console.log("Error in getUserView ", error.message);
    res.status(500).json({ error: "Internal Server  Error" });
  }
};
