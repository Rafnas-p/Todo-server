import User from "../model/userSchema";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    console.log('fgfgfgf');
    
    try {
        const { name, email, password } = req.body;
        

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new CustomError("Email already registered", 400));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const accessToken = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET  as string, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: newUser._id, email },process.env.JWT_SECRET  as string, { expiresIn: "7d" });

        // Set refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Only use in HTTPS
            sameSite: "strict"
        });

        // Send response
        res.status(201).json({ 
            message: "User registered successfully", 
            user: { id: newUser._id, name, email },
            accessToken
        });

    } catch (error) {
        next(new CustomError("Server error", 500));
    }
};

export const userlogin=async(req:Request,res:Response,next:NextFunction)=>{
    console.log('ksdjkad');
    
    const {email,password}=req.body
   
    const user= await User.findOne({email,isAdmin:false})
    if (!user) {
        return next(new CustomError('user not found', 404))
     }
     const isPasswordValid= await bcrypt.compare(password,user.password)
     if (!isPasswordValid) {
        return next(new CustomError("Invalid email or password", 404));
  
     }
     const token = jwt.sign(
        {
           id: user._id,
           email: user.email,
           role: 'User',
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1m" }
     );
  
     const refreshmentToken = jwt.sign(
        {
           id: user._id,
           email: user.email,
           role: 'User',
  
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
     );
      
     await User.findByIdAndUpdate(user._id, { updatedAt: Date.now() }, { new: true });
  
     res.cookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 1000,
        sameSite: 'none',
     });
     res.cookie('refreshToken', refreshmentToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
     });
  
     res.cookie(`user`, "user", {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
     });
  
  
  
     res.status(200).json({
        error: false,
        message: `user Login successfully`,
        accessToken: token,
        refreshmentToken: refreshmentToken,
        user: {
           id: user._id,
           name: user.name,
           email: user.email,
           role: 'User',
        },
     });
}