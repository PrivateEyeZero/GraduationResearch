import { Request, Response } from "express";
import Session from "../system/session";
import { sql_util } from "../system/mysql/sql_util";
import { sql, discord } from "../server";
import { DiscordUtil } from "../discord/discord_util";
import { group } from "console";

const BASIC_INFO = require("../basic_info.ts");

export const add_group = async (req: Request, res: Response) => {
  const session_id = req.body.session_id as string;
  const group_name = req.body.group_name as string;

  console.log(session_id);

  const uuid = Session.getSessionUser(session_id);
  console.log(uuid);
  if (uuid === null) {
    res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.INVALID_SESSION_MSG));
    return;
  }

  const integrations = await sql_util.getIntegrations(
    sql.getConnection(),
    uuid,
  );
  if (integrations.result === "failed") {
    res.send(integrations);
    return;
  }

  const discod_id: string = integrations.discord.toString();
  if (discod_id === null) {
    res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.NO_DISCOD_MSG));
    return;
  }

  const isManager = DiscordUtil.isRoleManager(discord.getGuild(), discod_id);
  if (!isManager) {
    res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.NO_PERMISSION_MSG));
    return;
  }

  const group_role =await DiscordUtil.createRole(discord.getGuild(), group_name);
  const group_channel = await DiscordUtil.createChannel(discord.getGuild(), group_name);
  if(!group_role || !group_channel){res.send(BASIC_INFO.FAILED_MSG("message", "no-msg"));return}
  const discord_result = await sql_util.addGroup(
    sql.getConnection(),
    BASIC_INFO.PROVIDER.DISCORD,
    group_name,
    BigInt(group_role),
    BigInt(group_channel),
  );


  if (discord_result.result === "success")
    DiscordUtil.sendLog(
      `**グループが作成されました。**\nグループ名: ${group_name}\nロール: <@&${group_role}>\nチャンネル: <#${group_channel}>`,
    );

  res.send(discord_result);
};
