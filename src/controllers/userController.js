import initModels from "../models/init-models.js";
import { sequelize } from "../models/connect.js";
import { responseData } from "../config/response.js";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import {
  checkToken,
  checkTokenRef,
  createToken,
  createTokenRef,
  decodeToken,
  decodeTokenUser,
} from "../config/jwt.js";
import nodemailer from "nodemailer";
import { where } from "sequelize";
import { decode } from "jsonwebtoken";
import fs from "fs";
import compress_images from "compress-images";

const model = initModels(sequelize);
const prisma = new PrismaClient();

const signUp = async (req, res) => {
  let { fullName, email, password } = req.body;

  let checkMail = await model.users.findOne({
    where: {
      email,
    },
  });

  if (checkMail) {
    responseData(res, "Email đã tồn tại", 400, "");
    return;
  }

  let newData = {
    full_name: fullName,
    email,
    pass_word: bcrypt.hashSync(password, 10),
  };

  await model.users.create(newData);
  responseData(res, "Đăng kí thành công", 200, "");
};

//Login
const login = async (req, res) => {
  let { email, password } = req.body;

  let checkMail = await model.users.findOne({
    where: {
      email,
    },
  });

  if (checkMail) {
    if (
      bcrypt.compareSync(password, checkMail.pass_word) ||
      checkMail.pass_word == password
    ) {
      let key = new Date().getTime();

      let token = createToken({
        userId: checkMail.dataValues.user_id,
        key,
        fullName: checkMail.dataValues.full_name,
      });

      let tokenRef = createTokenRef({
        userId: checkMail.dataValues.user_id,
        key,
      });

      checkMail.dataValues.refresh_token = tokenRef;

      await model.users.update(checkMail.dataValues, {
        where: {
          user_id: checkMail.dataValues.user_id,
        },
      });

      responseData(res, "ĐĂNG NHẬP THÀNH CÔNG", 200, token);
    } else {
      responseData(res, "MẬT KHẨU KHÔNG ĐÚNG", 400, "");
    }
    return;
  }
  responseData(res, "Email không đúng", 400, "");
};

//Login facebook
const loginFacebook = async (req, res) => {
  let { fullName, email, faceAppId } = req.body;

  let checkUser = await model.users.findOne({
    where: {
      face_app_id: faceAppId,
    },
  });

  let token = "";

  if (checkUser) {
    token = createToken({ userId: checkUser.dataValues.user_id });
    responseData(res, "Đăng nhập facebook thành công", 200, token);
  } else {
    let newData = {
      full_name: fullName,
      email,
      face_app_id: faceAppId,
      role: "USER",
    };

    let data = await model.users.create(newData);
    token = createToken({ userId: data.dataValues.user_id });
    responseData(
      res,
      "Đã tạo bằng facebook và đăng nhập thành công",
      200,
      token
    );
  }
};

//Check Email
const checkEmail = async (req, res) => {
  let { email } = req.params;

  let checkEmail = await model.users.findOne({
    where: {
      email,
    },
  });

  if (checkEmail) {
    //tạo code
    let code = new Date().getTime();
    let newCode = {
      code,
      expired: new Date(),
    };

    await model.code.create(newCode);

    //Dùng mật khẩu ứng dụng mail để tạo
    let transfor = nodemailer.createTransport({
      auth: {
        user: "khanguyen050321@gmail.com",
        pass: "jndzquhwsgyvlubz",
      },
      service: "gmail",
    });

    let sendOption = {
      from: "khanguyen050321@gmail.com",
      to: email,
      subject: "Lấy lại mật khẩu",
      text: "Code:" + code,
    };

    transfor.sendMail(sendOption, (err, info) => {});

    responseData(res, "Email đúng, code đã được gửi về mail", 200, true);
  } else {
    responseData(res, "Email không tồn tại", 200, false);
  }
};

//Check code
const checkCode = async (req, res) => {
  let { code } = req.params;

  let check_code = await model.code.findOne({
    where: {
      code,
    },
  });

  if (check_code) {
    responseData(res, "Code đúng", 200, true);
    //remove code
    await model.code.destroy({
      where: {
        id: check_code.id,
      },
    });
    return;
  }

  //Check exp

  responseData(res, "Code sai", 200, false);
};

//Change pass
const changePass = async (req, res) => {
  let { email, password } = req.body;

  let checkMail = await model.users.findOne({
    where: {
      email,
    },
  });

  if (checkMail) {
    // let pass_word = bcrypt.hashSync(password, 10);

    await model.users.update(
      {
        pass_word: password,
      },
      {
        where: {
          email,
        },
      }
    );
    responseData(res, "Đổi pass thành công", 200, true);
  } else {
    responseData(res, "Đổi pass thất bại", 200, false);
  }
};

//Refresh Token

// const refreshToken = async (req, res) => {
//   let { token } = req.headers;
//   let decode = decodeToken(token);

//   //Get user
//   let checkUser = await model.users.findOne({
//     where: {
//       user_id: decode.userId,
//     },
//   });

//   if (checkUser) {
//     let checkRefToken = checkTokenRef(checkUser.dataValues.refresh_token);

//     if (checkRefToken == null) {
//       let token = createToken({ userId: checkUser.dataValues.user_id });
//       responseData(res, "Tạo token mới thành công", 200, token);
//       return;
//     }
//     responseData(res, "Tạo token mới thất bại", 401, "");
//   }
// };

const refreshToken = async (req, res) => {
  let { token } = req.headers;

  //Check Token
  let errToken = checkToken(token);
  if (errToken != null && errToken.name != "TokenExpiredError") {
    responseData(res, "Token không đúng, không có quyền", 401, "");
    return;
  }

  //Get user và checkRefToken
  let { userId } = decodeToken(token);
  let getUserId = await model.users.findOne({
    where: {
      user_id: userId,
    },
  });
  let checkRefToken = checkTokenRef(getUserId.dataValues.refresh_token);
  if (checkRefToken != null) {
    responseData(res, "RefToken không hợp lệ", 401, "");
    return;
  }

  //Check key
  let decode = decodeToken(token);
  let { key } = decodeToken(getUserId.dataValues.refresh_token);
  console.log(key, "key");
  if (decode.key != key) {
    responseData(res, "Không có quyền", 401, "");
    return;
  }

  //Create token
  let newToken = createToken({ userId: getUserId.dataValues.user_id, key });
  responseData(res, "Tạo token mới thành công", 200, newToken);
};

//UPLOAD
const uploadAvartar = async (req, res) => {
  let file = req.file;
  let { token } = req.headers;
  console.log(token);
  // let { userId } = decodeToken(token);
  let { userId } = decodeToken(token);

  let getUserId = await model.users.findOne({
    where: {
      user_id: userId,
    },
  });
  getUserId.avatar = file.filename;

  await model.users.update(getUserId.dataValues, {
    where: {
      user_id: userId,
    },
  });

  responseData(res, "Upload thành công", 200, file.filename);
};
const compressImg = async (req, res) => {
  let file = req.file;

  //compress image
  compress_images(
    process.cwd() + "/public/img/" + file.filename,
    process.cwd() + "/public/compress/",
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    function (error, completed, statistic) {
      console.log("-------------");
      console.log(error);
      console.log(completed);
      console.log(statistic);
      console.log("-------------");
    }
  );
};

//LẤY DANH SÁCH USER
const getUser = async (req, res) => {
  let data = await prisma.users.findMany();

  responseData(res, "Danh sách user", 200, data);
};
export {
  getUser,
  signUp,
  login,
  loginFacebook,
  uploadAvartar,
  checkEmail,
  checkCode,
  changePass,
  refreshToken,
  compressImg,
};
