import express from "express";
import {
  changePass,
  checkCode,
  checkEmail,
  compressImg,
  getUser,
  login,
  loginFacebook,
  refreshToken,
  signUp,
  uploadAvartar,
} from "../controllers/userController.js";
import { upload } from "../config/upload.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/login-facebook", loginFacebook);
userRouter.post("/check-email/:email", checkEmail);
userRouter.post("/check-code/:code", checkCode);
userRouter.put("/change-pass", changePass);
userRouter.post("/refresh-token", refreshToken);

// API update avatar
userRouter.post("/upload-avatar", upload.single("avatar"), uploadAvartar);

userRouter.post("/compress-img", upload.single("avatar"), compressImg);

userRouter.get("/get-user", getUser);

export default userRouter;
