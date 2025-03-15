import {Request,Response,NextFunction} from 'express'


interface CustomError extends Error{
    statusCode?:number
    status?:string

}
const errorHandler= (err:CustomError,req:Request,res:Response,next:NextFunction):void=>{
  const statusCode = err.statusCode || 500;
  const message= err.message|| "internal server error"
  const status =err.status || "error"

  console.error("🔥 Error:", err);

  res.status(statusCode).json({
    success:false,
   status,
    message,
    statusCode


  })

}

export default errorHandler;

