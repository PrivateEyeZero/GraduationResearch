import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; // 追加
import dotenv from "dotenv";
import authRouter from "./auth/auth";
import groupRouter from "./group/group";
import messageRouter from "./message/message";
import path from "path";
import { SQL } from "./system/mysql/sql";
import { sql_util } from "./system/mysql/sql_util";
import { Discord } from "./discord/discord";

const app = express();
const BASIC_INFO = require("./basic_info.ts");

dotenv.config({ path: BASIC_INFO.ENV_PATH });

//nodejsの設定
app.use(cors());

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/group", groupRouter);
app.use("/message", messageRouter);

const server = http.createServer(app);
server.listen(BASIC_INFO.PORT, () => {
  console.log("Server started on port " + BASIC_INFO.PORT);
});

//sqlの設定
const sql: SQL = new SQL(
  process.env.MYSQL_HOST,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASS,
  process.env.MYSQL_DB_NAME,
);
sql.init();
sql_util.createAllTablesIfNotExists(sql.getConnection());

const discord = new Discord();

export { app, server, sql, discord };
