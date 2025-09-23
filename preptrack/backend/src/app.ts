import express, { Request, Response } from "express";
import { initializeDatabase } from "./config/Database";
import trackRouter from "./routes/TrackRoutes";
import authRouter from "./routes/AuthRoutes";
import * as dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(express.json());

const port: number = 8080;

app.use("/api/v1", trackRouter);
app.use("/api/v1", authRouter);

// this route is for health check of the app
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port number ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
