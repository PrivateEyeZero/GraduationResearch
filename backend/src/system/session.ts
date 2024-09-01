import { v4 as uuidv4 } from "uuid";
const BiMap = require('bidirectional-map');

export default class Session {
  static sessions_data = new BiMap();

  static createSession(id: string): string {
    const session_id = uuidv4();
    this.sessions_data.set(id, session_id);
    return session_id;
  }

  static getSessionId(id: string): string | undefined {
    return this.sessions_data.get(id);
  }

  static existSessionId(id: string): boolean {
    return this.sessions_data.has(id);
  }

  static getSessionUser(session_id: string): string | null {
    if(!this.sessions_data.hasValue(session_id)) return null;
    return this.sessions_data.getKey(session_id);
  }

  static checkSessionId(id: string, session_id: string): boolean {
    if (!this.sessions_data.has(id)) return false;
    return this.sessions_data.get(id) === session_id;
  }

}
