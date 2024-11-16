import { Request, Response } from "express";
import Session from "../system/session";
import { sql_util } from "../system/mysql/sql_util";
import { sql, discord } from "../server";
import { DiscordUtil } from "../discord/discord_util";
import { RESPONSE_MSG_TYPE } from "../basic_info";
const BASIC_INFO = require("../basic_info.ts");

export const send = async (req: Request, res: Response) => {
  const session_id = req.body.session_id as string;
  const provider = req.body.provider as string;
  const group_id = req.body.group_id as number;
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

  const groupInfo = await sql_util.getGroupProviderInfo(
    sql.getConnection(),
    group_id,
    provider,
  );
  const sendMessage = message + `\n\nsend by ${user.id}`;
  await sql_util.addMessage(
    sql.getConnection(),
    sendMessage,
    uuid,
    "group",
    -1,
    group_id,
  );
  const p = BASIC_INFO.PROVIDER;
  switch (provider) {
    case p.DISCORD:
      DiscordUtil.sendMessage(groupInfo?.channel as string, sendMessage);
      res.send(BASIC_INFO.SUCCESS_MSG());
      return;
    case p.TEAMS:
      return;
    case p.LINE:
      return;
    default:
      res.send(
        BASIC_INFO.FAILED_MSG("message", BASIC_INFO.INVALID_PROVIDER_MSG),
      );
      return;
  }
};
