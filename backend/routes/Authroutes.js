// backend/routes/Authroutes.js
import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;