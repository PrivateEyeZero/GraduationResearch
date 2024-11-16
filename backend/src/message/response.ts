import { Request, Response } from "express";
import Session from "../system/session";
import { sql_util } from "../system/mysql/sql_util";
import { sql, discord } from "../server";
import { DiscordUtil } from "../discord/discord_util";
import { RESPONSE_MSG_TYPE } from "../basic_info";
const BASIC_INFO = require("../basic_info.ts");

export const postResponse = async (req: Request, res: Response) => {
  const session_id = req.body.session_id as string;
  const message_id = req.body.message_id as number;
  const safety = req.body.safety as boolean;
  const content = req.body.content as string;

  const uuid = Session.getSessionUser(session_id);
  if (uuid === null) {
    res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.INVALID_SESSION_MSG));
    return;
  }

  console.log(`uuid: ${uuid}, message_id: ${message_id}, safety: ${safety}, content: ${content}`);
  sql_util.addResponse(sql.getConnection(),uuid, message_id, safety, content);
  res.send(BASIC_INFO.SUCCESS_MSG());
};


