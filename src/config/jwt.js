import jwt from "jsonwebtoken";
import { responseData } from "./response.js";

//Tạo token
const createToken = (data) => {
  return jwt.sign(data, "BI_MAT", { expiresIn: "30s" });
};

//Check Token
const checkToken = (token) => {
  return jwt.verify(token, "BI_MAT", (err) => err);
};

//Tạo refresh token
const createTokenRef = (data) => {
  return jwt.sign(data, "BI_MAT2", { expiresIn: "7d" });
};

//Check Refresh Token
const checkTokenRef = (token) => {
  return jwt.verify(token, "BI_MAT2", (err) => err);
};

//Decode token
const decodeToken = (token) => {
  return jwt.decode(token);
};

const decodeTokenUser = (token) => {
  return jwt.decode(token);
};
const middleToken = (req, res, next) => {
  let { token } = req.headers;
  //Nếu ko nhận được lỗi trả từ checkToken thì cho qua(=null)
  let check = checkToken(token);
  if (check == null) {
    next();
  } else {
    responseData(res, "", 401, check);
  }
};
export {
  createToken,
  checkToken,
  decodeToken,
  middleToken,
  createTokenRef,
  checkTokenRef,
  decodeTokenUser,
};
