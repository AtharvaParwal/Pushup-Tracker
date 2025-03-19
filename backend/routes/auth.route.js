import express from "express";
import { login, logoutUser, refreshAccessToken } from "../controllers/auth.controller.js";
import { verifyAccessToken, verifyRefreshToken } from "../middleware/auth.middleware.js"; 

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", verifyRefreshToken, refreshAccessToken);
router.post("/logout", verifyAccessToken, logoutUser); // Protect logout route

export default router;

