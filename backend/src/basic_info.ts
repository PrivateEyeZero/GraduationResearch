const PORT = "8080";
const SERVER_URL = "http://localhost:" + PORT;
const ENV_PATH = "data/.env";

const LOCAL_AUTH_URL = "http://localhost:3000/debug";
//Discord-Auth
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_AUTH_REDIRECT_URI =
  "http://localhost:" + PORT + "/auth/discord/callback";



//Response
export type RESPONSE_MSG_TYPE = { [key: string]: RESPONSE_MSG_TYPE | string };
const SUCCESS_MSG = (
  key: string | null = null,
  value: string | null = null,
): { [obj_key: string]: string } =>
  value === null ? { result: "success" } : { result: "success", [`${key}`]: value };
const FAILED_MSG = (
  key: string | null = null,
  value: string | null = null,
): { [obj_key: string]: string } =>
  value === null ? { result: "failed" } : { result: "failed", [`${key}`]: value };
const INVALID_SESSION_MSG = "invalid-session";

module.exports = {
  //System
  PORT,
  SERVER_URL,
  ENV_PATH,
  //Auth
  LOCAL_AUTH_URL,
  //Discord-Auth
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_AUTH_REDIRECT_URI,
  //Response
  SUCCESS_MSG,
  FAILED_MSG,
  INVALID_SESSION_MSG
};
