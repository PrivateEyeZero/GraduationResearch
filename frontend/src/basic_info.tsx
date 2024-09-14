const NON_SESSION_MSG = "non-session";

const BACKEND_URL = "http://localhost:8080";
const FLONTEND_URL = "http://localhost:3000";

const SYSTEM_NAME = "nitfc-gr";

const INVALID_SESSION_MSG = "invalid-session";
const INVALID_SESSION_PAGE = "/auth/invalid_session";

enum PROVIDER {
  DISCORD = "discord",
  LINE = "line",
  TEAMS = "teams",
}
export {
  BACKEND_URL,
  FLONTEND_URL,
  NON_SESSION_MSG,
  SYSTEM_NAME,
  INVALID_SESSION_MSG,
  INVALID_SESSION_PAGE,
  PROVIDER,
};
