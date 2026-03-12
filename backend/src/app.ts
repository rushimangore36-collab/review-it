import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import reviewRouter from "./routes/reviewRouter";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:8081"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieparser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/reviews", reviewRouter);

export default app;
