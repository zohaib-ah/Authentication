import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../Models/user.model";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const userExist = await userModel.find({ email });
    if (userExist) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password:hashedPassword });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3 * 24 * 60 * 1000,
    });

    return res.status(201).json({success: true, message: "Registration Complete"})

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password required" });
    }

    try {
      const userExist = await userModel.find({email})
      if (!userExist) {
        return res.status(401).json({ success: false, message: "Wrong Credentials" });
      }

      const isMatch = await bcrypt.compare( password , userExist.password)
      if(!isMatch){
        return res.status(401).json({ success: false, message: "Wrong password" });
      }

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {expiresIn: "3d",});

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 3 * 24 * 60 * 1000,
      });
  
      return res.status(200).json({success: true, message: "User logedin successfully"})

    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

export const logout = async (req,res) => {
    try {
        res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 3 * 24 * 60 * 1000,
      })

      return res.status(200).json({success: true ,message: "User loged Out"})
        
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
} 