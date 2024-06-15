import express from "express";
import cors from "cors";
import { rootRouter } from "./routes/rootRouter.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

//port
app.listen(8080);

//Tạo middleware
//Chuyển dạng json
app.use(express.json());

//Định vị đường dẫn tài nguyên
app.use(express.static("."));

//Mở cơ chế chặn of browser
app.use(cors());

//Kết nối với rootRouter
app.use(rootRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  //Nhận roomId từ client
  socket.on("join-room", async (roomId) => {
    socket.join(roomId);
    console.log(roomId);
    //show data chat ra layout
    let data = await prisma.chat.findMany({
      where: {
        room: roomId,
      },
    });
    //Gửi data chat từ csdl lên client
    io.to(roomId).emit("data-chat", data);
  });

  //Nhận đối tượng chứa content từ client
  socket.on("client-chat", async (data) => {
    //Lưu xuống csdl
    let newData = {
      user_id: data.user_id,
      content: data.content,
      room: data.room,
      date: new Date(),
    };
    await prisma.chat.create({ data: newData });
    io.to(data.room).emit("sv-send", data);
  });
});
httpServer.listen(8081);

//Swagger

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const options = {
    definition: {
        info: {
            title: "api ytb",
            version: "2.0.0"
        }
    },
    apis: ["src/swagger/index.js"]
}

const specs = swaggerJsDoc(options);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));


