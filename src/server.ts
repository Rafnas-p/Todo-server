import express,{Request,Response} from 'express'
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string
const app =express()


const PORT=process.env.PORT || 5000

mongoose
.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log("MongoDB Connection Error ❌", err));
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running 🚀");
});

app.listen(PORT,()=>{
  console.log(`surver running on Port ${PORT}`);
  
})