import { v4 as uuidv4 } from "uuid";

export default class Session {
  static sessions_data = new Map<string, string>();

  static createSession(id: string): string {
    const session_id = uuidv4();
    this.sessions_data.set(id, session_id);
    return session_id;
  }

  static getSessionId(id: string): string | undefined {
    return this.sessions_data.get(id);
  }

  static checkSessionId(id: string, session_id: string): boolean {
    if (!this.sessions_data.has(id)) return false;
    return this.sessions_data.get(id) === session_id;
  }
}
