import express from "express";
import { videoRouter } from "./videoRouter.js";
import userRouter from "./userRouter.js";

const rootRouter = express.Router();

//Kết nối với videoRouter
rootRouter.use("/video", videoRouter);
rootRouter.use("/user", userRouter);

export { rootRouter };
