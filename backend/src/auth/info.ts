import { Request, Response } from "express";
import { sql_util } from "../system/mysql/sql_util";
import { sql } from "../server";
import Session from "../system/session";

const BASIC_INFO = require("../basic_info.ts");

export const info = (req: Request, res: Response) => {
  const sesson_id = req.body.session_id as string;

  const uuid = Session.getSessionUser(sesson_id);

  if (uuid === null) {
    const failed_msg = BASIC_INFO.FAILED_MSG();
    failed_msg.message = BASIC_INFO.INVALID_SESSION_MSG;
    res.send(failed_msg);
    return;
  }

  sql_util
    .getIntegrations(sql.getConnection(), uuid)
    .then(async (result) => {
      result.uuid = uuid.toString();
      result.id = (await sql_util.getUser(sql.getConnection(), uuid)).id;

      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      res.send(BASIC_INFO.FAILED_MSG("mesage", error));
    });
};
