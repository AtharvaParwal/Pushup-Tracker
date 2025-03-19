import express from "express";
import { register, trackPushups, getProfile, changePassword, updateAvatar, getUserStats } from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js"; // Correct middleware import
import { upload } from "../utils/multer.js";

import { getLeaderboard } from "../controllers/user.controller.js";


const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/track-pushups", verifyAccessToken, trackPushups); // Use verifyAccessToken for protection
router.get("/profile", verifyAccessToken, getProfile);
router.put("/change-password", verifyAccessToken, changePassword);
router.patch("/avatar", verifyAccessToken, upload.single("avatar"), updateAvatar);

router.get("/stats", verifyAccessToken, getUserStats);

router.get("/leaderboard", getLeaderboard);


export default router;
