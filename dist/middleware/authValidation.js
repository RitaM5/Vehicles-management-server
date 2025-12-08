"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const auth = (...roles) => {
    return (req, res, next) => {
        try {
            const authToken = req.headers.authorization;
            if (!authToken) {
                return res.status(401).json({
                    message: "you are not allowed"
                });
            }
            ;
            const token = authToken.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            req.user = {
                id: Number(decoded.id),
                role: decoded.role,
                email: decoded.email,
                name: decoded.name
            };
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(401).json({
                    err: "Unathorized"
                });
            }
            next();
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    };
};
exports.default = auth;
