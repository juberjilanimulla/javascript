import express from "express";
import { login, forgotPassword } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;