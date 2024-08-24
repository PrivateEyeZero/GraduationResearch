const PORT = "8080";
const ENV_PATH = "data/.env";

//Discord-Auth
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_AUTH_REDIRECT_URI =
  "http://localhost:" + PORT + "/auth/discord/callback";

module.exports = {
  PORT,
  ENV_PATH,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_AUTH_REDIRECT_URI,
};
