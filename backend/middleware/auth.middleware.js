import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyAccessToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) throw new ApiError(401, "Unauthorized access");

    // Ensure token starts with "Bearer "
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("Decoded Token:", decoded); // Debugging

    // Attach user info to the request
    req.user = decoded;
    next();
  } catch (error) {
    // console.error("Token verification failed:", error); // Debugging
    next(new ApiError(401, "Invalid or expired access token"));
  }
};


// Middleware to verify refresh token before generating new tokens
export const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new ApiError(403, "Refresh token required");

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    next(new ApiError(403, "Invalid or expired refresh token"));
  }
};

