import { Request, Response } from "express";
import Session from "../system/session";
import { sql_util } from "../system/mysql/sql_util";
import { sql, discord } from "../server";
import { DiscordUtil } from "../discord/discord_util";
const BASIC_INFO = require("../basic_info.ts");

export const send = async (req: Request, res: Response) => {
  const session_id = req.body.session_id as string;
  const provider = req.body.provider as string;
  const channelId = req.body.channelId as bigint;
  const message = req.body.message as string;

  const uuid = Session.getSessionUser(session_id);
  console.log(uuid);
  if (uuid === null) {
    res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.INVALID_SESSION_MSG));
    return;
  }

  const user = await sql_util.getUser(sql.getConnection(), uuid);

  const integrations = await sql_util.getIntegrations(
    sql.getConnection(),
    uuid,
  );

  const p = BASIC_INFO.PROVIDER;
  switch (provider) {
    case p.DISCORD:
      const discord_id: string = integrations.discord.toString();
      if (discord_id === null) {
        res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.NO_DISCORD_MSG));
        return;
      }
      DiscordUtil.sendMessage(channelId, message + `\n\nsend by ${user.id}`);
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
