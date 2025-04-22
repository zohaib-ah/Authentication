import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../Models/user.model.js";
import transporter from "../config/nodeMailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const userExist = await userModel.findOne({ email });
 
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

    const mailOpt = {
      from:process.env.SENDER_MAIL,
      to: email,
      subject: "welcome to our platform",
      text: `your account has been created with email id: ${email}`
    }

    await transporter.sendMail(mailOpt);

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
      const userExist = await userModel.findOne({email})
      if (!userExist) {
        return res.status(401).json({ success: false, message: "Wrong Credentials" });
      }

      const isMatch = await bcrypt.compare( password , userExist.password)
      if(!isMatch){
        return res.status(401).json({ success: false, message: "Wrong password" });
      }

      const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {expiresIn: "3d",});

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


export const sendVerifyOtp = async (req,res) => {
    const {userId} = req.user;
    console.log("user: ", userId);
    try {
      const userExist = await userModel.findById(userId)
      if(userExist.isAccountVerified){
        return res.status(200).json({success: false, message: "already verified"})
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));

      userExist.verifyOtp = otp;
      userExist.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

      await userExist.save();

      const mailOpt = {
        from:process.env.SENDER_MAIL,
        to: userExist.email,
        subject: "Your OTP to verify Email",
        text: `you OTP is ${otp} for verification of your email`
      }
  
      await transporter.sendMail(mailOpt);
      return res.status(200).json({success: true, message: "Otp sent to the email"})

    } catch (error) {
      return res.status(500).json({success: false, message: error.message})
    }
}


export const verifyEmail = async (req, res) => {
  const {userId} = req.user;
  const {otp} = req.body;
  console.log(userId);
  console.log(otp);
  if(!userId || !otp){
    return res.status(400).json({success: false, message: "missing details"})
  }

  try {
    const userExist = await userModel.findById(userId);

    if(!userExist){
      return res.status(401).json({ success: false, message: "Wrong Credentials" });
    }
    console.log(userExist.verifyOtp);
    if(userExist.verifyOtp ==='' || userExist.verifyOtp !== otp){
      return res.status(400).json({success: false, message: "missing detail"})
    }

    if(userExist.verifyOtpExpireAt < Date.now()){
      return res.status(400).json({success: false, message: "OTP expired"})
    }

    userExist.isAccountVerified = true;
    userExist.verifyOtp = '' ;
    userExist.verifyOtpExpireAt = 0; 

    await userExist.save();

    return res.status(200).json({success: true, message: "verified"})
    


  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }

}


export const isAuthenticated = async (req, res) =>{
  try {
    return res.status(200).json({success: true, message: "User is authenticated"})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}



export const sendResetOtp = async (req, res) => {
   const {email} = req.body;

   try {
    const userExist = await userModel.findOne({email})
    if(!userExist){
      return res.status(401).json({ success: false, message: "Wrong Credentials" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    userExist.resetOtp = otp;
    userExist.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await userExist.save();

    const mailOpt = {
      from:process.env.SENDER_MAIL,
      to: userExist.email,
      subject: "Your reset Password OTP",
      text: `you reset password OTP is ${otp}. use this to reset the password.`
    }

    await transporter.sendMail(mailOpt);
    return res.status(200).json({success: true, message: "reset password Otp sent to the registered email"})

  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }

}


export const resetPassword = async(req,res) => {
  const {email, otp, newPassword} = req.body;

  if (!otp || !email || !newPassword ) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const userExist = await userModel.findOne({email});

    if(!userExist){
      return res.status(401).json({ success: false, message: "Wrong Credentials" });
    }
    console.log(userExist.resetOtp);
    if(userExist.resetOtp ==='' || userExist.resetOtp !== otp){
      return res.status(400).json({success: false, message: "missing detail"})
    }

    if(userExist.resetOtpExpireAt < Date.now()){
      return res.status(400).json({success: false, message: "OTP expired"})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    userExist.password = hashedPassword;
    userExist.resetOtp = '' ;
    userExist.resetOtpExpireAt = 0; 

    await userExist.save();

    return res.status(200).json({success: true, message: "Password reset successfully"})
    


  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }

}