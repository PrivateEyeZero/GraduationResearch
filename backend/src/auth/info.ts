import { Request, Response } from "express";
import { sql_util } from "../system/mysql/sql_util";
import { sql, discord } from "../server";
import { DiscordUtil } from "../discord/util";
import Session from "../system/session";

const BASIC_INFO = require("../basic_info.ts");

export const info = async (req: Request, res: Response) => {
  const sesson_id = req.body.session_id as string;

  const uuid = Session.getSessionUser(sesson_id);

  if (uuid === null) {
    const failed_msg = BASIC_INFO.FAILED_MSG();
    failed_msg.message = BASIC_INFO.INVALID_SESSION_MSG;
    res.send(failed_msg);
    return;
  }

  const result = await sql_util.getIntegrations(sql.getConnection(), uuid);
  result.uuid = uuid.toString();
  result.id = (await sql_util.getUser(sql.getConnection(), uuid)).id;
  result.groups = await sql_util.getUserGroups(sql.getConnection(), uuid);

  console.log(result);
  res.send(result);
};
