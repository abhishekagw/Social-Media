import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ errors: "Passwords Do not matching" });
    }
    const user = await User.findOne({ userName: username });
    if (user) {
      return res.status(400).json({ error: "User Already Exits" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //https://avatar-placeholder.iran.liara.run/

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName: fullname,
      userName: username,
      password: hashedPassword,
      gender: gender,
      profilePic: gender == "male" ? boyProfilePic : girlProfilePic,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (err) {
    console.log("Error in SignUp ", err.message);
    res.status(500).json({ error: "Internal Server  Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ userName: username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );   //if no user,it returns error,do like this to avoid errors,it compare with empty string ,if no user

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    generateTokenAndSetCookie(user._id,res);
    res.status(200).json({_id:user._id,fullName:user.fullName,userName:user.userName,profilePic:user.profilePic,
    })
  } catch (err) {
    console.log("Error in Login ", err.message);
    res.status(500).json({ error: "Internal Server  Error" });
  }
};
export const logout = (req, res) => {
 try{
  res.cookie('jwt',"",{maxAge:0});
  res.status(200).json({message:"Logged Out Succesfully"})
 }catch(err){
  console.log("Error in Logout ", err.message);
    res.status(500).json({ error: "Internal Server  Error" });
 }
};
