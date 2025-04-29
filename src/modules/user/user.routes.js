import { Router } from "express";
import {
  changeUserPassword,
  deleteAccount,
  getAccountByRecoveryEmail,
  getUser,
  getUserProfile,
  requestPasswordReset,
  signIn,
  signOut,
  signUp,
  updateAccount,
  verifyOTP,
} from "../user/user.controller.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import { protectedRoutes } from "../auth/auth.controller.js";
import { validate } from "../../middleware/validate.js";
import {
  changeUserPasswordValidSchema,
  signInValidSchema,
  signUpValidSchema,
  updateUserValidSchema,
} from "./user.validation.js";

const userRoutes = Router();

userRoutes.post("/signup", validate(signUpValidSchema), checkEmail, signUp);
userRoutes.post("/signin", validate(signInValidSchema), signIn);
userRoutes.post("/reqest-password-reset", requestPasswordReset);
userRoutes.post("/verifyotp", verifyOTP);
userRoutes.get("/getaccount", protectedRoutes, getAccountByRecoveryEmail);
userRoutes.put(
  "/update/:id",
  validate(updateUserValidSchema),
  protectedRoutes,
  updateAccount
);
userRoutes.delete("/delete/:id", protectedRoutes, deleteAccount);
userRoutes.get("/getuser/:id", protectedRoutes, getUser);
userRoutes.get("/getuserprofile/:id", protectedRoutes, getUserProfile);
userRoutes.patch(
  "/change-password/:id",
  validate(changeUserPasswordValidSchema),
  protectedRoutes,
  changeUserPassword
);
userRoutes.post("/signout/:id", signOut);

export default userRoutes;
