import User from "../model/userSchema";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
   try {
     const { name, email, password } = req.body;
 
     // Check if user already exists
     const existingUser = await User.findOne({ email });
     if (existingUser) return next(new CustomError("Email already registered", 400));
 
     // Hash password
     const hashedPassword = await bcrypt.hash(password, 10);
 
     // Create new user
     const newUser = new User({ name, email, password: hashedPassword });
     await newUser.save();
 
     // Generate JWT tokens
     const accessToken = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
     const refreshToken = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
 
     // Set refresh token in httpOnly cookie
     res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
     res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000, sameSite: "strict" });
 
     res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, name, email }, accessToken });
   } catch (error) {
     next(new CustomError("Server error", 500));
   }
 };

 export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
   try {
     const { email, password } = req.body;
     
     const user = await User.findOne({ email, isAdmin: false });
     if (!user) return next(new CustomError("User not found", 404));
 
     const isPasswordValid = await bcrypt.compare(password, user.password);
     if (!isPasswordValid) return next(new CustomError("Invalid email or password", 400));
 
     // Generate Tokens
     const accessToken = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
     const refreshToken = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
 
     // Set cookies
     res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000, sameSite: "strict" });
     res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: "strict" });
 
     res.status(200).json({ message: "User logged in successfully", accessToken, user: { id: user._id, name: user.name, email: user.email } });
   } catch (error) {
     next(new CustomError("Server error", 500));
   }
 };
 
 
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
   try {
     const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies
 
     if (!refreshToken) {
       return next(new CustomError("No refresh token provided", 403));
     }
 
     // Verify refresh token
     const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as { id: string };
 
     if (!decoded) {
       return next(new CustomError("Invalid refresh token", 403));
     }
 
     // Find user
     const user = await User.findById(decoded.id);
     if (!user) {
       return next(new CustomError("User not found", 404));
     }
 
     // Generate new access token
     const newAccessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, {
       expiresIn: "15m",
     });
 
     // Send new access token in cookie & response
     res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000, sameSite: "strict" });
 
     res.status(200).json({ accessToken: newAccessToken });
   } catch (error) {
     next(new CustomError("Failed to refresh token", 500));
   }
 };