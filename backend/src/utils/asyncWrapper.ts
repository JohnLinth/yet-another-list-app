import { Request, Response, NextFunction } from "express";

// asnyc wrapper function to catch errors in async functions without repeating try/catch blocks
export const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};