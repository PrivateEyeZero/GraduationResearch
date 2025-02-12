import { Request, Response } from "express";
import Session from "../system/session";
import { sql_util } from "../system/mysql/sql_util";
import { sql, discord } from "../server";

const BASIC_INFO = require("../basic_info.ts");

export const get_groups = async (req: Request, res: Response) => {
  const session_id = req.body.session_id as string;
  const uuid = Session.getSessionUser(session_id);
  console.log("get_groups user: ", uuid);
  if (uuid === null) {
    res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.INVALID_SESSION_MSG));
    return;
  }
  const result = await sql_util.getGroups(sql.getConnection());
  console.log("get_group result: ", result);
  res.send(result);
};
