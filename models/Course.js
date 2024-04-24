import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title:{
        type:String,
        required: [true,"Please enter Product title"],
        minLength:[4, "Title must be at least 4 characters"],
        maxLength:[80, "Title can be at max 80 characters"],
    },
    description:{
        type:String,
        required: [true,"Please enter Product description"],
        minLength:[10, "Description must be at least 10 characters"],
        maxLength:[150, "Description can be at max 150 characters"],
    },
    products:{
        title:{
            type:String,
           // required:false,
        },
        description:{
            type:String,
           // required:false,
        },
        image: {
            public_id:{
            type: String,
            //required: false,
            },
        
        url: {
            type: String,
            //required: false,
            },
        },
    },
       
            poster: {
                public_id:{
                type: String,
               // required: false,
                },
            
            url: {
                type: String,
                //required: false,
                },
            },
            views:{
                type:Number,
                default:0,
                  },
            category:{
                type:String,
                //required:false,
            },
            createdBy:{
                type:String,
                required:[true,"Enter Name of the Seller"]
            },
            createdAt:{
                type: Date,
                default: Date.now,
            },

        
        
});

export const Course= mongoose.model("Course",schema);