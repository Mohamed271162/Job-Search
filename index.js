// process.on("uncaughtException", () => {
//   console.log("error", err);
// });

import { AppError } from "./utils/appError.js";
import { User } from "./database/models/user.models.js";
import { bootstrap } from "./src/modules/bootstrap.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { globalError } from "./src/middleware/globalError.js";
import jwt from "jsonwebtoken";
import path from 'path'
import { config } from "dotenv";
import {connectionDB} from "./database/dbConnection.js"

config({ path: path.resolve('./config/config.env') })
const app = express();

app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;
connectionDB()
bootstrap(app);

app.get("/verify/:token", async (req, res, next) => {
  jwt.verify(
    req.params.token,
    process.env.JWT_KEY_EMAIL_TOKEN,
    async (err, payload) => {
      if (err) return next(new AppError(err, 401));
      await User.findOneAndUpdate(
        { email: payload.email },
        { confirmEmail: true }
      );
      res.json({ message: "success", email: payload.email });
    }
  );
});

app.use("*", (req, res, next) => {
  next(new AppError(`route is not found ${req.originalUrl}`, 404));
});

app.use(globalError);

process.on("unhandledRejection", (err) => {
  console.log("error", err);
});

app.get("/", (req, res) => res.send("Hello World"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
