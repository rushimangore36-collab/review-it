import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import reviewRouter from "./routes/reviewRouter";
import followRouter from "./routes/followRouter";

const app = express();

app.use(
  cors({
    origin:
      "https://review-4hakdpi0i-rushimangore36-collabs-projects.vercel.app/",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieparser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/reviews", reviewRouter);
app.use("/follows", followRouter);

export default app;
