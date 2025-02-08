import { Request, Response } from "express";
import { sql, discord } from "../../server";
import Session from "../../system/session";
import { sql_util } from "../../system/mysql/sql_util";
const BASIC_INFO = require("../../basic_info.ts");

export const edit_member = async (req: Request, res: Response) => {
  console.log("add_member run!");
  const con = sql.getConnection();
  const group_id = req.body.group_id as string;
  const target_uuid = req.body.uuid as string;
  const type = req.body.type ?? ("add" as "add" | "remove");
  if (!group_id || !target_uuid) {
    res.send(BASIC_INFO.FAILED_MSG("message", "group_id or uuid are required"));
    return;
  }
  const session_id = req.body.session_id as string;
  const uuid = Session.getSessionUser(session_id);
  console.log(
    `${type}_member user: (group:`,
    group_id,
    ", target:",
    target_uuid,
    ")"
  );
  if (uuid === null) {
    res.send(BASIC_INFO.FAILED_MSG("message", BASIC_INFO.INVALID_SESSION_MSG));
    return;
  }
  let result;

  switch (type) {
    case "add":
      result = await sql_util.addMember(
        con,
        parseInt(target_uuid),
        parseInt(group_id)
      );
      break;
    case "remove":
      result = await sql_util.removeMember(
        con,
        parseInt(target_uuid),
        parseInt(group_id)
      );
      break;
    default:
      res.send(BASIC_INFO.FAILED_MSG("message", "invalid type"));
      return;
  }

  console.log(`${type}_member result:`, result);
  res.send(result);
};
