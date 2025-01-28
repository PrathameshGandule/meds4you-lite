import { Router } from "express";
import { registerUser , login } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", login);

export default authRoutes;