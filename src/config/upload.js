// yarn add multer
import multer, { diskStorage } from "multer";
// process.cwd() => trả về đường dẫn gốc của project => /Users/Download/node40_backend /public/img
// bị trùng tên hình
const upload = multer({
  storage: diskStorage({
    destination: process.cwd() + "/public/img", // khai báo đường dẫn lưu file

    // filename: (req, file, callback) => { // đổi tên file

    //     // tránh trùng tên ?
    //     // datetime => 30/03/2024 14:40:00,001_cat.jpeg
    //     // 174241204213_꧁ℭôղɕ ζúɑ ✘ʊâղ꧂.jpeg => 174241204213_ong_ua_uan.jpeg
    //     // hàm loại bỏ ký tự đăc biệt và koảng trắng => regex

    //     let newName = new Date().getTime() + "_" + file.originalname

    //     callback(null, newName)
    // },

    filename: (req, file, callback) =>
      callback(null, new Date().getTime() + "_" + file.originalname),
  }),
});

export { upload };
