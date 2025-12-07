import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/authValidation";


const router = express.Router();

router.get("/users", auth("admin"), userControllers.getUser);
router.put("/users/:userId", auth("admin","customer"), userControllers.userUpdate);
router.delete("/users/:userId", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
