import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err.message);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // just default to 500 if not set
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
