import { Request, Response } from "express";
import Session from "../system/session";
import { sql_util } from "../system/mysql/sql_util";
import { sql, discord } from "../server";
import { DiscordUtil } from "../discord/util";
import { RESPONSE_MSG_TYPE } from "../basic_info";
import { Line } from "../line/util";
const BASIC_INFO = require("../basic_info.ts");

export const send = async (req: Request, res: Response) => {
  console.log("send", req.body);
  const session_id = req.body.session_id as string;
  const providers = req.body.providers as string[];
  const group_ids = req.body.group_ids as number[];
  const message = req.body.message as string;

  const uuid = Session.getSessionUser(session_id);
  if (uuid === null) {
    res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.INVALID_SESSION_MSG));
    return;
  }

  const user = await sql_util.getUser(sql.getConnection(), uuid);

  const integrations = await sql_util.getIntegrations(
    sql.getConnection(),
    uuid,
  );

  let sendMessage = message + `\n\nsend by ${user.id}`;
  const id = (await sql_util.addMessage(sql.getConnection(), sendMessage, uuid))
    .id;
  sendMessage += `\n安否応答: ${BASIC_INFO.FRONT_URL}/message/response?message_id=${id}`;

  let res_code = 200;
  group_ids.forEach(async (group_id) => {
    await sql_util.addMessageTarget(
      sql.getConnection(),
      parseInt(id as string),
      "group",
      group_id,
    );
    providers.forEach(async (p) => {
      console.log(p);
      const groupInfo = await sql_util.getGroupProviderInfo(
        sql.getConnection(),
        group_id,
        p,
      );
      const PROVIDER = BASIC_INFO.PROVIDER;
      switch (p) {
        case PROVIDER.DISCORD:
          DiscordUtil.sendMessage(groupInfo?.channel as string, sendMessage);
          console.log("discord");
          return;
        case PROVIDER.TEAMS:
          return;
        case PROVIDER.LINE:
          Line.sendMessage(sendMessage);
          console.log("line");
          return;
        default:
          res_code = 400;
          console.log("none");
          return;
      }
    });
  });
  switch (res_code) {
    case 200:
      res.send(BASIC_INFO.SUCCESS_MSG());
      return;
    case 400:
      res.send(BASIC_INFO.FAILED_MSG("message", "Invalid provider"));
      return;
    default:
      res.send(BASIC_INFO.FAILED_MSG("message", "Unknown error"));
      return;
  }
};
