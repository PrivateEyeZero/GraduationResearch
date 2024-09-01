require("dotenv").config();
import { Request, Response } from "express";
import Session from "../system/session";

const BASIC_INFO = require("../basic_info.ts");

const REDIRECT_URL = BASIC_INFO.SERVER_URL + "/auth/discord/callback";

export const discord = (req: Request, res: Response) => {
  const session_id = req.body.session_id //req.body.session_id as string;
  const user_id = "silv"//Session.getSessionUser(session_id);
  if(user_id === null) {
    const failed_msg = BASIC_INFO.FAILED_MSG("session_id", "Invalid session_id");
    failed_msg.detail="session_error"
    res.send(failed_msg);
    return;
  }
  // Discord認証のURLを構築
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=identify&state=${session_id}`;
  // クライアントにDiscord認証のURLを返す
  res.json({ redirectUrl: discordAuthUrl });
}

export const discord_callback = (req: Request, res: Response) => {
  const { code, state } = req.query;

  // コードを使ってアクセストークンを取得する処理（省略）

  // ランダムな文字列とともに処理を行う
  console.log('Received state:', state);
  console.log('Authorization code:', code);

  // 処理が終わったらクライアントにリダイレクトするURLを返す
  res.redirect('http://localhost:3000/debug');
}