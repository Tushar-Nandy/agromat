import express from "express";
import { addProducts, createCourse, deleteCourse, getAllCourses, getCourseLectures } from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/courses").get(getAllCourses);
router.route("/createcourse").post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

//add and delete courses

router
.route("/courses/:id")
.get(isAuthenticated,getCourseLectures)
.post(isAuthenticated,authorizeAdmin,singleUpload, addProducts)
.delete(isAuthenticated, authorizeAdmin,deleteCourse); //course id not lecture id


router.route("/lecture").delete(isAuthenticated, authorizeAdmin, singleUpload, createCourse);
export default router;