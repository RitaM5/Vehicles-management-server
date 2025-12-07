import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";


const auth = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authToken = req.headers.authorization;
            if (!authToken) {
                return res.status(401).json({
                    message: "you are not allowed"
                })
            };
            const token = authToken.split(" ")[1];
            const decoded = jwt.verify(token as any, config.jwtSecret as string) as JwtPayload;
            req.user = {
                id: Number(decoded.id),
                role: decoded.role,
                email: decoded.email,
                name: decoded.name
            };
            if (roles.length && !roles.includes(decoded.role as string)) {
                return res.status(401).json({
                    err: "Unathorized"
                })
            }
            next();

        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
};

export default auth;