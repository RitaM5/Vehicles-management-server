import { Request, Response } from "express";
import { authServices } from "./auth.services";

const signUp = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signUp(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }

}
const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authServices.signIn(email, password);
    if (result.success === false) {
      return res.status(401).json(result);
    }
    return res.status(201).json({
      success: true,
      message: "Login successful",
      data: result
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }

}


export const authControllers = {
  signUp,
  signIn
}