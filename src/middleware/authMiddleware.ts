import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/userSchema";

// ✅ Extend Express Request Type
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can define a more specific type for 'user' instead of 'any'
    }
  }
}

// ✅ Middleware to verify user authentication
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization; // Get token from headers

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    // ✅ Fetch user details (Optional)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    req.user = user; // Attach user to request
    next(); // Move to next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};

export default authMiddleware;


