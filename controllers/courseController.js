import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import {Course} from "../models/Course.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from 'cloudinary';

export const getAllCourses = catchAsyncError(async (req,res,next)=>{
    
    const courses= await Course.find();
    res.status(200).json({
        success: true,
        courses,
    });
});

export const createCourse = catchAsyncError(async (req,res,next)=>{
    
   const {title,description,category,createdBy}=req.body;

   if(!title || !description || !category || !createdBy){
    return next(new ErrorHandler("Please add all fields", 400));
   }

   const file = req.file;
  // console.log(file);
const fileUri= getDataUri(file); //problem of path name as string no idea why have to check about it! as aa result can't use cloudinary

const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

   await Course.create({
    title,
    description,
    category,
    createdBy,
    poster:{
        public_id:mycloud.public_id,
        url: mycloud.secure_url,
    }
   });



    res.status(201).json({
        success: true,
        message: "Products created successfully. You can add lectures now",
    });
});


export const getCourseLectures = catchAsyncError(async (req,res,next)=>{
    
    const course= await Course.findById(req.params.id);

    if(!course) return next(new ErrorHandler("Course not found",404));
    course.views+=1;
    await course.save();


    res.status(200).json({
        success: true,
        products: course.products, 
    });
});

export const addProducts = catchAsyncError(async (req,res,next)=>{

const {id} = req.params;

    const {title,description} = req.body;

   // const file=req.file;
    
    const course= await Course.findById(id);

    if(!course) return next(new ErrorHandler("Course not found",404));

    const file = req.file;
    // console.log(file);
  const fileUri= getDataUri(file); //problem of path name as string no idea why have to check about it! as aa result can't use cloudinary
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content,{
    resource_type:"image",
  });
  

course.products.push({
    title,
    description,
    image:{
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
    }
});
course.numOfVideos=course.products.length;
    await course.save();


    res.status(200).json({
        success: true,
       message:"Product added in Shop" 
    });
});


export const deleteCourse = catchAsyncError(async (req,res,next)=>{

    
    const {id}=req.params;
    const course = await Course.findById(id);
 if(!course) return next(new ErrorHandler("Course not found", 404));

 await cloudinary.v2.uploader.destroy(course.poster.public_id);

for (let i=0;i<course.products.length;i++){
    const singleProduct= course.products[i];

    await cloudinary.v2.uploader.destroy(singleProduct.image.public_id);

};

await course.remove();
   
 
     res.status(200).json({
         success: true,
         message: "Product deleted successfully.",
     });
 });