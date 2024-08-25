import express, { Request, Response } from "express";
import { sql_util } from "../system/mysql/sql_util";
import { sql } from "../server";
import Session from "../system/session";

const BASIC_INFO = require("../basic_info.ts");

export const register = (req: Request, res: Response) => {
  const id = req.body.id as string;
  const pass = req.body.pass as string;
  const pass2 = req.body.pass2 as string;
  if (pass !== pass2) {
    res.send(
      BASIC_INFO.FAILED_MSG("message", "パスワードが確認用と一致しません"),
    );
    return;
  }

  sql_util
    .addUser(sql.getConnection(), id, pass)
    .then((result) => {
      if (result.result === "success")
        result.session_id = Session.createSession(id);
      res.send(result);
    })
    .catch((error) => {
      res.send(BASIC_INFO.FAILED_MSG("mesage", error));
    });
};
