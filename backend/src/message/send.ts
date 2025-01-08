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
  const providers = req.body.service as string[];
  const group_ids = req.body.group_ids as number[] ?? [];
  const user_ids = req.body.user_ids as number[] ?? [];
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

  const sendedUserSet = new Set<number>();
  group_ids.forEach(async (group_id) => {
    await sql_util.addMessageTarget(
      sql.getConnection(),
      parseInt(id as string),
      "group",
      group_id,
    );
    const g_members = (await sql_util.getGroupMembers(sql.getConnection(), group_id.toString())).members as any[];

    
    providers.forEach(async (p) => {
      console.log(p);
      const groupInfo = await sql_util.getGroupServiceInfo(
        sql.getConnection(),
        group_id,
        p,
      );
      const PROVIDER = BASIC_INFO.PROVIDER;
      switch (p) {
        case PROVIDER.DISCORD:
          DiscordUtil.sendChannelMessage(groupInfo?.channel as string, sendMessage);
          console.log("discord");
          return;
        case PROVIDER.TEAMS:
          return;
        case PROVIDER.LINE:
          g_members.forEach(async (m: any) => {
            const t_user = m.uuid;
            if(sendedUserSet.has(t_user)) return;
            const lineId = (await sql_util.getIntegrations(sql.getConnection(), t_user)).line as string;
            if(lineId === null || lineId=="") return;
            Line.sendMessage(lineId,sendMessage);
          })
          
          console.log("line");
          return;
        default:
          res_code = 400;
          console.log("none");
          return;
      }
    });

    g_members.forEach(async (m: any) => {
      sendedUserSet.add(m.uuid);
    })
  });

  user_ids.forEach(async (user_id) => {
    if(sendedUserSet.has(user_id)) return;
    const integration = (await sql_util.getIntegrations(sql.getConnection(), user_id));
    providers.forEach(async (p) => {
      console.log(p);
      const PROVIDER = BASIC_INFO.PROVIDER;
      switch (p) {
        case PROVIDER.DISCORD:
          const discordId = integration.discord as string;
          if(discordId === null || discordId=="") return;
          DiscordUtil.sendUserMessage(discordId, sendMessage);
          console.log("discord");
          return;
        case PROVIDER.TEAMS:
          return;
        case PROVIDER.LINE:
          const lineId = integration.line as string;
          if(lineId === null || lineId=="") return;
          Line.sendMessage(lineId,sendMessage);
          
          console.log("line");
          return;
        default:
          res_code = 400;
          console.log("none");
          return;
      }
    });
  })

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
