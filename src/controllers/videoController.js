import initModels from "../models/init-models.js";
import { sequelize } from "../models/connect.js";
import { responseData } from "../config/response.js";
import { where } from "sequelize";

const model = initModels(sequelize);
const getVideo = async (req, res) => {
  let data = await model.video.findAll({
    include: ["type", "user"],
  });
  responseData(res, "Thành công", 200, data);
};

const getVideoById = async (req, res) => {
  let { videoId } = req.params;
  let data = await model.video.findByPk(videoId, { include: ["user"] });
  responseData(res, "Thành công", 200, data);
};

const getVideoType = async (req, res) => {
  let data = await model.video_type.findAll();
  responseData(res, "Thành công", 200, data);
};

const getVideoByType = async (req, res) => {
  let { typeId } = req.params;

  let data = await model.video.findAll({
    where: {
      type_id: typeId,
    },
  });
  responseData(res, "Thành công", 200, data);
};

const getVideoPage = async (req, res) => {
  let { page } = req.params;
  let pageSize = 3;
  let index = pageSize * (page - 1);

  let data = await model.video.findAll({
    offset: index,
    limit: pageSize,
  });

  let countData = await model.video.count();
  responseData(res, "Thành công", 200, {
    data,
    pagination: Math.ceil(countData / pageSize),
  });
};

const searchVideo = (req, res) => {
  res.send("Tìm video");
};

export {
  getVideo,
  getVideoById,
  searchVideo,
  getVideoType,
  getVideoByType,
  getVideoPage,
};
