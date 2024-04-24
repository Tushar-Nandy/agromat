import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js"
import cors from "cors"
config({
    path: "./config/config.env",
})

const app= express();

//using middlewares

app.use(express.json());
app.use(express.urlencoded({
    extended:true,
}));

app.use(cookieParser());
app.use(cors({credentials:true ,origin:"http://localhost:3000"}));




import course from "./routes/courseRoutes.js";
import user from "./routes/userRoutes.js";

app.use("/api/v1",course);
app.use("/api/v1",user);

export default app;

app.use(ErrorMiddleware)