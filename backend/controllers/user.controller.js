import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {generateAccessAndRefreshTokens} from "./auth.controller.js";

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const avatarLocalPath = req.file?.path;

  if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
      return res.status(409).json({ message: "User with email or username already exists" });
  }

  let avatar;
  if (avatarLocalPath) {
      avatar = await uploadToCloudinary(avatarLocalPath);
  }

  const user = await User.create({
      username,
      email,
      password,
      avatar: avatar || process.env.DEFAULT_AVATAR, // Set default avatar if none provided
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  // Ensure proper success response format
  return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
          user: {
              id: user._id,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
          },
          accessToken,
          refreshToken,
      },
  });
});


const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id); // Use `id` instead of `userId`

  if (!user || !(await user.isPasswordCorrect(oldPassword))) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

const trackPushups = asyncHandler(async (req, res) => {
  const { pushupCount } = req.body;

  // Validate pushupCount
  if (isNaN(pushupCount) || pushupCount < 0) {
    throw new ApiError(400, "Invalid push-up count. It must be a positive number.");
  }

  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update push-up count
  user.pushupCount += pushupCount;

  // Update personal best if the current session count exceeds previous best
  if (pushupCount > user.personalBest) {
    user.personalBest = pushupCount;
  }

  // Update level based on new total push-up count
  user.level = calculateLevel(user.pushupCount);

  // Save the updated user
  await user.save();

  res.status(200).json(new ApiResponse(200, {
    pushupCount: user.pushupCount,
    personalBest: user.personalBest,
    level: user.level,
  }, "Push-up count updated successfully"));
});

const getProfile = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(new ApiResponse(200, "Profile fetched", user));
  } catch (error) {
    // console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


const updateAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json(new ApiResponse(400, "No file uploaded"));
    }
    try {
      const avatarUrl = await uploadToCloudinary(req.file.path);
  
      if (!avatarUrl) {
        return res.status(500).json(new ApiResponse(500, "Failed to upload avatar"));
      }
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: avatarUrl },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json(new ApiResponse(404, "User not found"));
      }
      res.status(200).json(new ApiResponse(200, "Avatar updated successfully", user));
    } 
    catch (error) {
      res.status(500).json(new ApiResponse(500, "Internal server error", error.message));
    }
});
  

const getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, {
      pushupCount: user.pushupCount,
      personalBest: user.personalBest,
      level: user.level
    }, "User stats retrieved successfully"));
  } 
  catch (error) {
    next(error);
  }
};

const calculateLevel = (pushupCount) => {
    if (pushupCount >= 115000) return 50;
    if (pushupCount >= 113000) return 49;
    if (pushupCount >= 112000) return 48;
    if (pushupCount >= 111000) return 47;
    if (pushupCount >= 105000) return 46;
    if (pushupCount >= 100000) return 45;
    if (pushupCount >= 95000) return 44;
    if (pushupCount >= 90000) return 43;
    if (pushupCount >= 85000) return 42;
    if (pushupCount >= 80000) return 41;
    if (pushupCount >= 75000) return 40;
    if (pushupCount >= 70000) return 39;
    if (pushupCount >= 65000) return 38;
    if (pushupCount >= 60000) return 37;
    if (pushupCount >= 55000) return 36;
    if (pushupCount >= 50000) return 35;
    if (pushupCount >= 46000) return 34;
    if (pushupCount >= 42000) return 33;
    if (pushupCount >= 38000) return 32;
    if (pushupCount >= 34000) return 31;
    if (pushupCount >= 30000) return 30;
    if (pushupCount >= 26000) return 29;
    if (pushupCount >= 23000) return 28;
    if (pushupCount >= 20000) return 27;
    if (pushupCount >= 18000) return 26;
    if (pushupCount >= 16000) return 25;
    if (pushupCount >= 14000) return 24;
    if (pushupCount >= 12000) return 23;
    if (pushupCount >= 10000) return 22;
    if (pushupCount >= 8000) return 21;
    if (pushupCount >= 7000) return 20;
    if (pushupCount >= 6000) return 19;
    if (pushupCount >= 5000) return 18;
    if (pushupCount >= 4000) return 17;
    if (pushupCount >= 3000) return 16;
    if (pushupCount >= 2500) return 15;
    if (pushupCount >= 2000) return 14;
    if (pushupCount >= 1500) return 13;
    if (pushupCount >= 1000) return 12;
    if (pushupCount >= 500) return 11;
    if (pushupCount >= 400) return 10;
    if (pushupCount >= 300) return 9;
    if (pushupCount >= 200) return 8;
    if (pushupCount >= 150) return 7;
    if (pushupCount >= 100) return 6;
    if (pushupCount >= 50) return 5;
    if (pushupCount >= 30) return 4;
    if (pushupCount >= 10) return 3;
    if (pushupCount >= 5) return 2;
    if (pushupCount >= 1) return 1;
    return 0;
};

// const getLeaderboard = asyncHandler(async (req, res) => {
//   try {
//     const users = await User.find()
//       .sort({ pushupCount: -1 }) // Sorting by pushupCount (highest first)
//       .limit(5)
//       .select("username pushupCount personalBest level avatar");

//     // Ensuring order remains correct
//     const sortedUsers = users
//       .map(user => ({
//         username: user.username,
//         total_pushups: user.pushupCount, // Ensuring correct field name
//         personal_best: user.personalBest,
//         level: user.level,
//         avatar: user.avatar
//       }))
//       .sort((a, b) => b.total_pushups - a.total_pushups); // Final check for sorting

//     res.status(200).json({
//       success: true,
//       message: "Top users retrieved successfully",
//       data: sortedUsers, // Sending sorted data
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error retrieving leaderboard",
//       error: error.message,
//     });
//   }
// });
const getLeaderboard = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
      .sort({ pushupCount: -1, personalBest: -1, createdAt: -1 }) // Sorting priority
      .limit(5)
      .select("username pushupCount personalBest level avatar createdAt"); // Include createdAt for sorting

    // Formatting response
    const sortedUsers = users.map(user => ({
      username: user.username,
      total_pushups: user.pushupCount,
      personal_best: user.personalBest,
      level: user.level,
      avatar: user.avatar
    }));

    res.status(200).json({
      success: true,
      message: "Top users retrieved successfully",
      data: sortedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving leaderboard",
      error: error.message,
    });
  }
});



export {register, changePassword, trackPushups, getProfile, updateAvatar, getUserStats, getLeaderboard };
