require("dotenv").config();
import { Request, Response } from "express";
import { sql_util } from "../system/mysql/sql_util";
import { LINE_ENV, sql } from "../server";
import Session from "../system/session";
import axios from "axios";

const BASIC_INFO = require("../basic_info.ts");

const LINE_REDIRECT_URL = BASIC_INFO.SERVER_URL + "/auth/line/callback";

export const line = (req: Request, res: Response) => {
  const session_id = req.body.session_id;
  console.log(session_id);
  const uuid = Session.getSessionUser(session_id);

  if (uuid === null) {
    const failed_msg = BASIC_INFO.FAILED_MSG(
      "session_id",
      "Invalid session_id",
    );
    failed_msg.detail = "session_error";
    res.send(failed_msg);
    return;
  }

  // LINE認証のURLを構築
  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_ENV.authChannelId}&redirect_uri=${LINE_REDIRECT_URL}&state=${session_id}&scope=profile%20openid`;
  // クライアントにLINE認証のURLを返す
  res.json({ redirectUrl: lineAuthUrl });
};

export const line_callback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const session_id = state as string;
  const uuid = Session.getSessionUser(session_id);

  console.log("uuid", Session.getSessionUser(session_id));
  if (uuid === null) {
    const failed_msg = BASIC_INFO.FAILED_MSG(
      "session_id",
      "Invalid session_id",
    );
    failed_msg.detail = "session_error";
    res.send(failed_msg);
    return;
  }

  console.log("Received state:", state);
  console.log("Authorization code:", code);

  try {
    // LINEからアクセストークンを取得
    const tokenResponse = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: LINE_REDIRECT_URL,
        client_id: LINE_ENV.authChannelId!,
        client_secret: LINE_ENV.authChannelSecret!,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    console.log(tokenResponse.data);
    const accessToken = tokenResponse.data.access_token;

    // アクセストークンを使ってユーザー情報を取得
    const userResponse = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userId = userResponse.data.userId;
    console.log("line-auth user-data", userResponse.data);

    const con = sql.getConnection();
    await sql_util.updateIntegration(con, uuid, "line", userId);
  } catch (error) {
    console.error("Error:", error);
    res.send({ success: false, message: "LINE authentication failed." });
    return;
  }

  // 処理が終わったらクライアントにリダイレクトするURLを返す
  res.redirect(BASIC_INFO.LOCAL_AUTH_URL);
};
