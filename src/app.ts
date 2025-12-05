import express, { Request, Response } from "express";
import router from "./routes";
import dataBase from "./config/db";

const app = express();

app.use(express.json());
app.use(router);

dataBase();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path
  });
});

export default app;