import express from "express";
import {
  getVideo,
  getVideoById,
  getVideoByType,
  getVideoPage,
  getVideoType,
  searchVideo,
} from "../controllers/videoController.js";
import { checkToken, middleToken } from "../config/jwt.js";

const videoRouter = express.Router();

//localhost:8080/video/get-video
videoRouter.get("/get-video", middleToken, getVideo);

videoRouter.get("/get-video-by-id/:videoId", getVideoById);

videoRouter.get("/get-video-type", getVideoType);

videoRouter.get("/get-video-by-type/:typeId", getVideoByType);

videoRouter.get("/get-video-page/:page", getVideoPage);

//localhost:8080/video/search-video
videoRouter.get("/search-video", searchVideo);

export { videoRouter };
