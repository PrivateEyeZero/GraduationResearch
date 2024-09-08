import { v4 as uuidv4 } from "uuid";
const BiMap = require("bidirectional-map");

export default class Session {
  static sessions_data = new BiMap();

  static createSession(id: string): string {
    const session_id = uuidv4();
    this.sessions_data.set(id, session_id);
    console.log(this.sessions_data);
    return session_id;
  }

  static getSessionId(uuid: string): string | undefined {
    return this.sessions_data.get(uuid);
  }

  static existSessionId(session_id: string): boolean {
    return this.sessions_data.has(session_id);
  }

  static getSessionUser(session_id: string): number | null {
    if (!this.sessions_data.hasValue(session_id)) return null;
    return parseInt(this.sessions_data.getKey(session_id));
  }

  static checkSessionId(uuid: string, session_id: string): boolean {
    if (!this.sessions_data.has(uuid)) return false;
    return this.sessions_data.get(uuid) === session_id;
  }
}
