require("dotenv").config();
import { Request, Response } from "express";
import { sql_util } from "../system/mysql/sql_util";
import { sql } from "../server";
import Session from "../system/session";
import axios from "axios";

const BASIC_INFO = require("../basic_info.ts");

const REDIRECT_URL = BASIC_INFO.SERVER_URL + "/auth/discord/callback";

export const discord = (req: Request, res: Response) => {
  const session_id = req.body.session_id; //req.body.session_id as string;
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
  // Discord認証のURLを構築
  console.log("clent_id", process.env.DISCORD_CLIENT_ID);
  console.log("redirect_uri", REDIRECT_URL);
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=identify&state=${session_id}`;
  // クライアントにDiscord認証のURLを返す
  res.json({ redirectUrl: discordAuthUrl });
};

export const discord_callback = async (req: Request, res: Response) => {
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

  // ランダムな文字列とともに処理を行う
  console.log("Received state:", state);
  console.log("Authorization code:", code);
  try {
    // Discordからアクセストークンを取得
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: REDIRECT_URL,
        scope: "identify",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const accessToken = tokenResponse.data.access_token;

    // アクセストークンを使ってユーザー情報を取得
    const userResponse = await axios.get(
      "https://discord.com/api/v10/users/@me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const userId = userResponse.data;

    const con = sql.getConnection();

    await sql_util.updateIntegration(con, uuid, userId.id);
  } catch (error) {
    console.error("Error:", error);
  }
  // 処理が終わったらクライアントにリダイレクトするURLを返す
  res.redirect(BASIC_INFO.LOCAL_AUTH_URL);
};
