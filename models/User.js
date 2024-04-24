import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Please Enter your Name"],
    },
    email:{
        type:String,
        required: [true,"Please Enter your Email"],
        unique: true,
        validate: validator.isEmail,
    },
    password:{
        type:String,
        required: [true,"Please Enter your Password"],
        minLength: [6,"Password must be atleast 6 characters long"],
       select: false,
    },
    role:{
        type:String,
        enum: ["admin","user"],
       default:"user",
        },
    avatar:{
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }

    },
    playlist:[{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Course" ,
        },
        poster: String,
    },],

    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken :String,
    resetPasswordExpire:String,

});

schema.pre("save",async function(next){
    if(!this.isModified("password")) return next(); 
this.password= await bcrypt.hash(this.password, 10); //this is used to hash the password and there are 10 rounds in it
next();
});

schema.methods.getJWTToken = function(){
   return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {
    expiresIn: "15d",
   });
};

schema.methods.comparePassword = async function(password){

    //console.log(this.password); just for checking
    return await bcrypt.compare(password, this.password)
    };

    schema.methods.getResetToken = function(){
        
        const resetToken= crypto.randomBytes(20).toString("hex");

        this.resetPasswordToken= crypto.createHash("sha256").update(resetToken).digest("hex");

        this.resetPasswordExpire= Date.now()+15*60*1000;  // 15 min from now

        return resetToken;
    }

export const User= mongoose.model("User",schema);