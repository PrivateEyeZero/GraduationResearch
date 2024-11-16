import { Request, Response } from "express";
import Session from "../system/session";
import { sql_util } from "../system/mysql/sql_util";
import { sql} from "../server";
const BASIC_INFO = require("../basic_info.ts");

type MESSAGE_LIST_TYPE = {
  message_id: string,
  content: string,
  sender: string,
  status: string,
  user: string,
  group: string,
}
export const getMessages = async (req: Request, res: Response) => {
  const session_id = req.body.session_id as string;
  const uuid = Session.getSessionUser(session_id);
  if (uuid === null) {
    res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.INVALID_SESSION_MSG));
    return;
  }
  const messages = (await sql_util.getAllMessages(sql.getConnection())).data as Object[] as MESSAGE_LIST_TYPE[];
  const renamed_message = await Promise.all(messages.map(async (message) => {
    message.sender = (await sql_util.getUser(sql.getConnection(), parseInt(message.sender))).id as string;
    if (message.status == "user") message.user = (await sql_util.getUser(sql.getConnection(), parseInt(message.user))).id as string;
    else message.group = (await sql_util.getGroupName(sql.getConnection(), parseInt(message.group))).group_name as string;
    return message;
  }));
  res.send(BASIC_INFO.SUCCESS_MSG("messages",renamed_message));
}