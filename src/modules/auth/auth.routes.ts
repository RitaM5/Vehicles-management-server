import express from "express";
import { authControllers } from "./auth.controllers";

const router = express.Router();

router.post("/auth/signup", authControllers.signUp);
router.post("/auth/signin", authControllers.signIn);

export const authRoutes = router;