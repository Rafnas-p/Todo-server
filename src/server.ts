import express,{Request,Response} from 'express'
import errorHandler from './middleware/ErrorHandler';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import AuthROute from './routes/authRoutes';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string
const app =express()
app.use(express.json()); 

const PORT=process.env.PORT || 5000
mongoose
.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log("MongoDB Connection Error ❌", err));
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running 🚀");
});
const FRONTEND_URI = process.env.FRONTEND_URI// ✅ Remove any accidental 

const corsOparations = {
  origin: FRONTEND_URI, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-MongoDb-Id"],
  credentials: true,
};

app.use(cors(corsOparations))
app.use('/api/auth',AuthROute)
app.use(errorHandler)



app.listen(PORT,()=>{
  console.log(`surver running on Port ${PORT}`);
  
})