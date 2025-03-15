class CustomError extends Error{
    statusCode:number;
    status:string;
    isOperational: boolean;
    constructor(message: string, statusCode: number = 500) {
        super(message); 
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'failed' : 'error';
        this.isOperational = true; 

        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;