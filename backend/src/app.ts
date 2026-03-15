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
    origin: (origin, callback) => {
      const allowed = [/\.vercel\.app$/, /^http:\/\/localhost/];
      if (!origin || allowed.some((pattern) => pattern.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
