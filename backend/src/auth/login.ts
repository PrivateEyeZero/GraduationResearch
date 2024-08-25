import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { sql_util } from "../system/mysql/sql_util";
import { sql } from "../server";
import Session from "../system/session";

const BASIC_INFO = require("../basic_info.ts");

// `/auth`エンドポイントを処理するルートを設定します
export const login = (req: Request, res: Response) => {
  const id = req.body.id as string;
  const pass = req.body.pass as string;
  console.log(`id: ${id}, pass: ${pass}`);

  sql_util
    .authUser(sql.getConnection(), id, pass)
    .then((result) => {
      if (result.result === "success")
        result.session_id = Session.createSession(id);
      res.send(result);
    })
    .catch((error) => {
      res.send(BASIC_INFO.FAILED_MSG("mesage", error));
    });
};
