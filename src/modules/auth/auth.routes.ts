import express from "express";
import { authControllers } from "./auth.controllers";

const router = express.Router();

router.post("/", authControllers.signUp);

export const authRoutes = router;