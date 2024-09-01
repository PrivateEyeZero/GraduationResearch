import { SYSTEM_NAME } from "@/basic_info";

export class Session{
  static readonly HOUR_1 = 60* 60 * 1000;
  static readonly DAY_1 = 24 * Session.HOUR_1;

  static getSessionId(): string|null{
    if(typeof window === "undefined")return null;
    const session_data  = localStorage.getItem(SYSTEM_NAME);
    if(!session_data)return null;
    const session_data_json = JSON.parse(session_data);
    const now = Date.now();

    const generateTime = session_data_json.generate_time;
    const lastUse = session_data_json.last_use;

    const isExpired = now - generateTime > Session.DAY_1;
    const isInactive = now - lastUse > Session.HOUR_1;

    if(isExpired || isInactive){
      localStorage.removeItem(SYSTEM_NAME);
      return null;
    }
    session_data_json.last_use = now;
    localStorage.setItem(SYSTEM_NAME, JSON.stringify(session_data_json));
    return session_data_json.session_id;
  }

  static setSessionId(session_id: string){
    if(typeof window === "undefined")return null;
    const session_data = {
      session_id,
      generate_time: Date.now(),
      last_use: Date.now()
    }
    localStorage.setItem(SYSTEM_NAME, JSON.stringify(session_data));
  }

}