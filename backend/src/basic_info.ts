const BACK_PORT = "8080";
const FRONT_PORT = "3000";
const SERVER_URL = "http://localhost:" + BACK_PORT;
const FRONT_URL = "http://localhost:" + FRONT_PORT;

const ENV_PATH = "data/.env";

const LOCAL_AUTH_URL = "http://localhost:3000/debug";
//Discord-Auth
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_AUTH_REDIRECT_URI =
  "http://localhost:" + BACK_PORT + "/auth/discord/callback";

//Response
export type RESPONSE_MSG_TYPE = {
  [key: string]: RESPONSE_MSG_TYPE | string | string[];
};
const SUCCESS_MSG = (
  key: string | null = null,
  value: string | null = null,
): { [obj_key: string]: string } =>
  value === null
    ? { result: "success" }
    : { result: "success", [`${key}`]: value };
const FAILED_MSG = (
  key: string | null = null,
  value: string | null = null,
): { [obj_key: string]: string } =>
  value === null
    ? { result: "failed" }
    : { result: "failed", [`${key}`]: value };

const INVALID_SESSION_MSG = "invalid-session";
const INVALID_PROVIDER_MSG = "invalid-provider";
const NO_PERMISSION_MSG = "no-permission";
const NO_DISCOD_MSG = "no-registerd-discord";

//Provider
enum PROVIDER {
  DISCORD = "discord",
  LINE = "line",
  TEAMS = "teams",
}

module.exports = {
  //System
  PORT: BACK_PORT,
  SERVER_URL,
  FRONT_URL,
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
  INVALID_SESSION_MSG,
  NO_PERMISSION_MSG,
  NO_DISCOD_MSG,
  INVALID_PROVIDER_MSG,

  //Provider
  PROVIDER,
};
