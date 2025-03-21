import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
        );

        user.refreshToken = refreshToken; // Save as plain text

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, "Email and password are required");
  
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");
  
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  
    // debugging
    // console.log("Login Response:", { accessToken, refreshToken });
  
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "Login successful"));
  });

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken: incomingRefreshToken } = req.body;
    if (!incomingRefreshToken) throw new ApiError(403, "Refresh token required");

    const user = await User.findOne({ refreshToken: incomingRefreshToken });
    if (!user) throw new ApiError(403, "Invalid refresh token");

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (decoded.id !== user._id.toString()) {
            throw new ApiError(403, "Invalid refresh token");
        }

        // Generate new tokens
        const newAccessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
        );

        const newRefreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
        );

        // Update stored refresh token
        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        throw new ApiError(403, "Invalid or expired refresh token");
    }
});


const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");

    user.refreshToken = null; // Clear refresh token
    await user.save();

    res.status(200).json({ message: "Logout successful" });
});

export { generateAccessAndRefreshTokens, login, refreshAccessToken, logoutUser };
