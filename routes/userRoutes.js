//see lecture 25 again for postman
import express from "express";
import { addToPlayList, changePassword, changeProfile, changeProfilePicture, forgetPassword, getMyProfile, login, logout, register, removeFromPlayList, resetPassword } from "../controllers/userController.js";
import {isAuthenticated} from "../middlewares/auth.js"
import { authcheck } from "../controllers/userController.js";


const router = express.Router();


// to register ur new user
router.route("/register").post(register);

//login
router.route("/login").post(login);

//logout
router.route("/logout").get(logout);
//get my profile
router.route("/me").get(isAuthenticated, getMyProfile);
//change password
router.route("/changepassword").put(isAuthenticated, changePassword);
//update profile
router.route("/changeprofile").put(isAuthenticated, changeProfile);
//update profile picture
router.route("/changeprofilepic").put(isAuthenticated, changeProfilePicture); 
// forget password
router.route("/forgetpassword").post(forgetPassword); 
//reset password
router.route("/resetpassword/:token").put(resetPassword); 
//add to playlist
router.route("/addplaylist").post(isAuthenticated,addToPlayList);
//remove from playlist
router.route("/removeplaylist").delete(isAuthenticated,removeFromPlayList);
router.route("/auth_check").get(isAuthenticated,authcheck)

export default router;