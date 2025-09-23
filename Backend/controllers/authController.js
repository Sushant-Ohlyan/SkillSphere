const userModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodeMailer');
require('dotenv').config();

const TOKEN_EXPIRY = "2d";
const COOKIE_MAX_AGE = 2 * 24 * 60 * 60 * 1000; // 2 days

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const userExists = await userModel.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Username or Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ username, email, password: hashedPassword });
        await newUser.save();

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            maxAge: COOKIE_MAX_AGE
        });

        // send welcome mail (don't block registration if fails)
        try {
            await transporter.sendMail({
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Welcome to Our App!',
                text: `Hello ${username}, your account has been created successfully.`
            });
        } catch (mailErr) {
            console.error("Email sending failed:", mailErr.message);
        }

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { id: newUser._id, username: newUser.username, email: newUser.email }
        });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password){
        return res.status(400).json({success: false, message: "Email and Password are required"});
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success:false, message:"User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid Password' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict', 
            maxAge: COOKIE_MAX_AGE
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const logOut = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 0
        });
        return res.status(200).json({ success: true, message: "Logged Out" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const sendVerifyOtp= async(req,res)=>{
    try{
        const {userId}=req.body;
        const user= await userModel.findById(userId);
        
        if(user.isAccountVerified){
            return res.json({success: false, message: "Account Already Verified"})
        }
        const otp = String(Math.floor(100000 + Math.random()*900000));
        user.verifyOtp= otp;
        user.verifyOtpExpiry=Date.now() + 24 * 60 *60 * 1000;
        
        await user.save();
        const mailOption={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Verify oyp',
            text: `verify ${otp}`
        }
        await transporter.sendMail(mailOption);
        res.json({success:true,message:'email for verification sent'});

    }catch(err){
        res.json({success:false, message: err.message});
    }
};

const verifyEmail= async(req,res)=>{
    const{userId, otp}=req.body;
    if(!userId || !otp){
        return res.json({success: false, message: 'Missing Details'});
    }
    try{
        const user =await userModel.findById(userId);
        if(!user){
            return res.json({ success: false, message: 'not found user'})
        }
        if (user.verifyOtp=== '' || user.verifyOtp !==otp){
            return res.json({success:false, message: 'INVALID OTP'});
        }
        if(user.verifyOtpExpiry <Date.now()){
            return res.json({success:false, message: 'otp expired'});
        }
        user.isVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpiry=0;
        await user.save();
        return res.json({success:true, message:'Email verified' });

    }catch(error){res.json({success:false,message: error.message })}
};

const isAuthenticated=async(req,res)=>{
    try{
        return res.json({success:true, message: "yesssss"});
    }
    catch(error){
        return res.json({success:false, message: "Noooooo"});
    }

};

export const sendResetOtp=async(req,res)=>{
        const{email}=req.body;
        if(!email){
            return res.json({success:false, message: "noooo"});
        }
        try{
            const user = await userModel.findOne({email});
            if (!user){
                return res.json({success:false, message: "noooo"});
            }

            const otp=String(Math.floor(100000+Math.random()*900000));
            user.resetPasswordOtp=otp;
            user.resetPasswordOtpExpiry= Date.now()+15*60*1000;
            await user.save();

            const mailOption={
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Reset pass',
                text: `pass reset opt is ${otp} will expire in 15 minutes`
            };
            await transporter.sendMail(mailOption);
            return res.json({success:true, message: "yes"});


        }catch(err){
            return res.json({success:false, message: err.message});
        }
    
};


export const resetPassword = async(req,res)=>{
    const {email, otp, newPassword}=req.body;

    if(!email || !otp|| !newPassword){
        return res.json({success:false, message: "noooo"});
    }
    try{
        const user= await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message: "noooo"});
        }
        if(user.resetPasswordOtp ==="" || user.resetPasswordOtp != otp ){
            return res.json({success:false, message: "nooo"});
        }
        if(user.resetPasswordOtpExpiry < Date.now()){
            return res.json({success:false, message: "nooo"});
        }
         const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOtp='';
        user.resetPasswordOtpExpiry=0;
        await user.save();
        return res.json({success:true, message: "yesssss"});

    }catch(error){
        return res.json({success:false, message: error.message});
    }

};

module.exports = { registerUser, loginUser, logOut, verifyEmail, sendVerifyOtp , isAuthenticated};
