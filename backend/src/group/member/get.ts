import { Request, Response } from "express";
import { sql, discord } from "../../server";
import Session from "../../system/session";
import { sql_util } from "../../system/mysql/sql_util";
const BASIC_INFO = require("../../basic_info.ts");

export const get_member = async (req: Request, res: Response) => {
  const con = sql.getConnection();
  const group_id = req.body.group_id as string;
  const session_id = req.body.session_id as string;
  const uuid = Session.getSessionUser(session_id);
  console.log("get_member user: ",uuid);
  if (uuid === null) {
    res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.INVALID_SESSION_MSG));
    return;
  }
  const result = await sql_util.getGroupMembers(con, group_id);
  res.send(result);
};
