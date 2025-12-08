import { Request, Response } from "express";
import { userServices } from "./user.services";
import { JwtPayload } from "jsonwebtoken";

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
};

const userUpdate = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const loggedInUser = {
            id: req.user.id,
            role: req.user.role
        };
        const result = await userServices.updateUser(req.body, Number(req.params.userId!), loggedInUser);
        if (!result) {
            return res.status(404).json({
                success: false
            });
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(Number(req.params.userId));
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const userControllers = {
    getUser,
    userUpdate,
    deleteUser
}