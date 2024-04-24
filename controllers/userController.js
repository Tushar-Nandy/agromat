import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import {User } from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendemail.js";
import {Course} from "../models/Course.js"


export const register= catchAsyncError(async(req,res,next)=>{

    const {name, email, password}= req.body;

    //const file = req.file;

    if(!name || !password || !email) 
    {return next(new ErrorHandler("Please enter all the fields", 400));}

    let user= await  User.findOne({email});

    if(user) {
        return next(new ErrorHandler("User already exists", 409));}

    // upload file on cloudinary;

    user = await User.create({
        name, 
        email,
        password,
         avatar:{
            public_id: "tempId",
            url: "tempURl",
         },
    });

    sendToken(res, user, "Registered Successfully", 201);

});

export const login= catchAsyncError(async(req,res,next)=>{

    const {email, password}= req.body;

    //const file = req.file;

    if(!password || !email) 
    {return next(new ErrorHandler("Please enter all the fields", 400));}

    const user= await  User.findOne({email}).select("+password");


    if(!user) {
        return next(new ErrorHandler("User Doesn't Exists", 401));}

    // upload file on cloudinary;

    const isMatch = await user.comparePassword(password);

    if(!isMatch) {
        return next(new ErrorHandler("Incorrect Email or Password", 401));}



    sendToken(res, user, `Welcome Back, ${user.name}`, 201);

});

export const logout= catchAsyncError(async(req,res,next)=>{

    res.status(200).cookie("token",null,{
    expires: new Date(Date.now()),
}).json({
    success: true,
    message: "Logged out successfully"
});
});

export const getMyProfile= catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user._id);

    res
      .status(200)
      .json({
    success: true,
    user,
    
});
});

export const changePassword= catchAsyncError(async(req,res,next)=>{

    const {oldPassword,newPassword} = req.body;

    if(!oldPassword || !newPassword) 
    {return next(new ErrorHandler("Please enter all the fields", 400));}

    const user = await User.findById(req.user._id).select("+password"); //+password is used in order to get the hashed pasword in order to compare it

    const isMatch = await user.comparePassword(oldPassword); 
    if(!isMatch) 
    {return next(new ErrorHandler("Enter the password correctly", 400));}

    user.password = newPassword;

    await user.save();

    res
      .status(200)
      .json({
    success: true,
    user,
    message: "Password changed successfully."
    
});
});

export const changeProfile= catchAsyncError(async(req,res,next)=>{

    const {name,email} = req.body;

    const user = await User.findById(req.user._id).select("+password"); //+password is used in order to get the hashed pasword in order to compare it

    if(name) 
    {user.name=name;}
    if(email) 
    {user.email=email;}


    await user.save();

    res
      .status(200)
      .json({
    success: true,
    user,
    message: "Profile updated successfully."
    
});
});

export const changeProfilePicture = catchAsyncError(async(req,res,next)=>{

    //cloudinary to do
    res.status(200).json({
        success:true,
        message: "Profile picture updated successfully"
    });
});

export const forgetPassword = catchAsyncError(async(req,res,next)=>{

    const {email}= req.body;
    const user= await User.findOne({email});

    if(!user){
        return next(new ErrorHandler("User not found", 400));
    }

    const resetToken= await user.getResetToken();

    await user.save();

    //send token via email
    const url= `${process.env.FRONTEND_URL}/ resetpassword/${resetToken}`;
    const message=`Click on the link to reset your password. ${url}. If you have not requested to change the password please ignore or contact us from our website.`
    await sendEmail(user.email,"AgroMart Reset Password",message)

    res.status(200).json({
        success:true,
        message: `Resend token has been sent to ${user.email}`
    });
});

export const resetPassword = catchAsyncError(async(req,res,next)=>{

    const {token}=req.params;
    const resetPasswordToken= crypto.createHash("sha256").update(token).digest("hex");

    const user= await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
        $gt: Date.now(),
    },
   
    })
    if(!user) return next(new ErrorHandler("Reset Token is invalid or has been expired"));

    user.password=req.body.password;

    user.resetPasswordExpire=undefined;
    user.resetPasswordToken=undefined;

    await user.save();

    //cloudinary to do
    res.status(200).json({
        success:true,
        message: "Password changed successfully."
    });
});

export const addToPlayList =catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.body.id);

    if(!course) return next(new ErrorHandler("Invalid Course id",404));

    const itemExist = user.playlist.find((item)=>{
        if(item.course.toString()===course._id.toString()) return true;
    })

    if(itemExist) return next(new ErrorHandler("Item already exists",409));

    user.playlist.push({
        course:course._id,
        poster:course.poster.url,
    });

    await user.save();
    res.status(200).json({
        success:true,
        message: "Products added Successfully"
    });

});

export const removeFromPlayList =catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.query.id);
    if(!course) return next(new ErrorHandler("Invalid Course id",404));

    const newPlaylist = user.playlist.filter(item=>{
        if(item.course.toString()!==course._id.toString()) return item;
    });

    user.playlist=newPlaylist;


    await user.save();
    res.status(200).json({
        success:true,
        message: "Products removed Successfully"
    });

});

export const authcheck = catchAsyncError(async (req, res, next) => {
    res.send({ success: true, message: "Authenticated" });
  });


