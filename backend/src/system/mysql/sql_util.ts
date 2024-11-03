import mysql from "mysql2";
import { RESPONSE_MSG_TYPE } from "../../basic_info";

const BASIC_INFO = require("../../basic_info.ts");

export class sql_util {
  //create-table
  static async createAllTablesIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    await sql_util.createUserTableIfNotExists(con);
    await sql_util.createIntegrationTableIfNotExists(con);
    await sql_util.createGroupTableIfNotExists(con);
    await sql_util.createGroupMemberTableIfNotExists(con);
    await sql_util.createMessageTableIfNotExists(con);
    await sql_util.createResponseTableIfNotExists(con);
  }
  static async createUserTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS user (
          uuid INT AUTO_INCREMENT PRIMARY KEY,
          id VARCHAR(32) NOT NULL UNIQUE,
          pass VARCHAR(32) NOT NULL,
          admin BOOL NOT NULL DEFAULT FALSE,
          enable BOOL NOT NULL DEFAULT TRUE
        );
      `;

      con.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  //user-table
  static async addUser(
    con: mysql.Connection,
    id: string,
    pass: string,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `INSERT INTO user (id, pass) VALUES (?, ?)`;

    return new Promise((resolve, reject) => {
      con.query(query, [id, pass], (error, results) => {
        if (error) {
          console.log(error);

          if (error.code === "ER_DUP_ENTRY") {
            resolve(
              BASIC_INFO.FAILED_MSG("message", "IDが既に登録されています"),
            );
          } else {
            resolve(BASIC_INFO.FAILED_MSG("message", error.message));
          }
        } else {
          resolve(BASIC_INFO.SUCCESS_MSG());
        }
      });
    });
  }

  static async getAllUser(con: mysql.Connection): Promise<{ uuid: number; id: string }[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT uuid, id FROM user;
      `;
  
      con.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const rows = results as mysql.RowDataPacket[];
          resolve(BASIC_INFO.SUCCESS_MSG("members",rows.map((row) => ({ uuid: row.uuid, id: row.id }))));
        }
      });
    });
  }

  static async authUser(
    con: mysql.Connection,
    id: string,
    pass: string,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `SELECT * FROM user WHERE id = ? AND pass = ?`;

    return new Promise((resolve, reject) => {
      con.query(query, [id, pass], (error, results) => {
        if (error) resolve(BASIC_INFO.FAILED_MSG("message", error.message));
        const rows = results as mysql.RowDataPacket[];
        if (rows.length === 0) {
          resolve(
            BASIC_INFO.FAILED_MSG("message", "IDまたはパスワードが違います"),
          );
        } else {
          const res = BASIC_INFO.SUCCESS_MSG();
          res.uuid = rows[0].uuid;
          resolve(res);
        }
      });
    });
  }

  static async getUser(
    con: mysql.Connection,
    uuid: number,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `SELECT id FROM user WHERE uuid = ?`;

    return new Promise((resolve, reject) => {
      con.query(query, [uuid], (error, results) => {
        if (error) {
          resolve(BASIC_INFO.FAILED_MSG("message", error.message));
        } else {
          const rows = results as mysql.RowDataPacket[];
          if (rows.length === 0) {
            resolve(
              BASIC_INFO.FAILED_MSG("message", "指定されたIDは存在しません"),
            );
          } else {
            const res = BASIC_INFO.SUCCESS_MSG();
            res.id = rows[0].id;
            resolve(res);
          }
        }
      });
    });
  }

  static async getUUID(
    con: mysql.Connection,
    id: string,
  ): Promise<string | null> {
    const query = `SELECT uuid FROM user WHERE id = ?`;

    return new Promise((resolve, reject) => {
      con.query(query, [id], (error, results) => {
        if (error) {
          resolve(null);
        } else {
          const rows = results as mysql.RowDataPacket[];
          if (rows.length === 0) {
            resolve(
              BASIC_INFO.FAILED_MSG("message", "指定されたIDは存在しません"),
            );
          } else {
            // UUIDを取得し、レスポンスとして返す
            const uuid = rows[0].uuid;
            resolve(uuid);
          }
        }
      });
    });
  }

  //Group-table
  static async createGroupTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS \`group\` (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(32) NOT NULL UNIQUE,
          provider VARCHAR(32) NOT NULL,
          role TEXT,
          channel TEXT
        );
      `;

      con.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  static async addGroup(
    con: mysql.Connection,
    provider: string,
    name: string,
    role: bigint,
    channel: bigint,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      INSERT INTO \`group\` (name, provider, role, channel)
      VALUES (?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      con.query(
        query,
        [name, provider, role, channel],
        (error, results) => {
          if (error) {
            resolve(BASIC_INFO.FAILED_MSG("message", error));
          } else {
            resolve(BASIC_INFO.SUCCESS_MSG());
          }
        },
      );
    });
  }

  static async getGroups(
    con: mysql.Connection
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      SELECT id, name 
      FROM \`group\`
    `;
  
    return new Promise((resolve, reject) => {
      con.query(query, (error, results) => {
        if (error) {
          resolve(BASIC_INFO.FAILED_MSG("message", error.message));
        } else {
          const rows = results as mysql.RowDataPacket[];
          const groupIds = rows.map(row => ({id:row.id,name:row.name}));
          const res = BASIC_INFO.SUCCESS_MSG();
          res.groups = groupIds;
          resolve(res);
        }
      });
    });
  }

  static async getGroupsInfo(
    con: mysql.Connection,
    group_id: number,
    provider: string,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      SELECT id, name, provider, role, channel 
      FROM \`group\`
      WHERE id = ? AND provider = ?
    `;

    return new Promise((resolve, reject) => {
      con.query(query, [group_id, provider], (error, results) => {
        if (error) {
          resolve(BASIC_INFO.FAILED_MSG("message", error.message));
        } else {
          const rows = results as mysql.RowDataPacket[];
          if (rows.length === 0) {
            resolve(
              BASIC_INFO.FAILED_MSG(
                "message",
                "指定されたグループは存在しません",
              ),
            );
          } else {
            console.log(rows[0].role);
            const res = BASIC_INFO.SUCCESS_MSG();
            res.role = rows[0].role;
            res.channel = rows[0].channel;
            console.log(res.role);
            resolve(res);
          }
        }
      });
    });
  }

  //GroupMember-table
  static async createGroupMemberTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS group_member (
          user_id INT,
          group_id INT,
          FOREIGN KEY (user_id) REFERENCES user(uuid) ON DELETE CASCADE,
          FOREIGN KEY (group_id) REFERENCES \`group\`(id) ON DELETE CASCADE
        );
      `;

      con.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  static async addMember(
    con: mysql.Connection,
    user_id: number,
    group_id: number,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      INSERT INTO group_member (user_id, group_id)
      VALUES (?, ?)
    `;
    console.log("sql-addmember",user_id, group_id);
    return new Promise((resolve, _) => {
      con.query(query, [user_id, group_id], (error, results) => {
        if (error) {
          resolve(BASIC_INFO.FAILED_MSG("message", error.message));
        } else {
          resolve(BASIC_INFO.SUCCESS_MSG());
        }
      });
    });
  }

  static async getGroupMembers(
    con: mysql.Connection,
    group_name: string
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      SELECT u.id, u.uuid 
      FROM user u
      JOIN group_member gm ON u.uuid = gm.user_id
      JOIN \`group\` g ON gm.group_id = g.id
      WHERE g.id = ?
    `;
  
    return new Promise((resolve, reject) => {
      con.query(query, [group_name], (error, results) => {
        if (error) {
          resolve(BASIC_INFO.FAILED_MSG("message", error.message));
        } else {
          const rows = results as mysql.RowDataPacket[];

          const members = rows.map((row) => ({
            uuid: row.uuid,
            id: row.id
          }));
          const res = BASIC_INFO.SUCCESS_MSG();
          res.members = members;
          resolve(res);
          
        }
      });
    });
  }
  

  static async getUserGroups(
    con: mysql.Connection,
    userId: number,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      SELECT g.name 
      FROM group_member gm
      JOIN \`group\` g ON gm.group_id = g.id
      WHERE gm.user_id = ?
    `;
  
    return new Promise((resolve, reject) => {
      con.query(query, [userId], (error, results) => {
        if (error) {
          resolve(BASIC_INFO.FAILED_MSG("message", error.message));
        } else {
          const rows = results as mysql.RowDataPacket[];
          const groupNames = rows.map(row => row.name);
          const res = BASIC_INFO.SUCCESS_MSG();
          res.groupNames = groupNames;
          resolve(res);

        }
      });
    });
  }

  //Integration-table
  static async createIntegrationTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS integration (
          uuid INT PRIMARY KEY,
          discord VARCHAR(32),
          line VARCHAR(32),
          github VARCHAR(32),
          teams VARCHAR(32),
          FOREIGN KEY (uuid) REFERENCES user(uuid) ON DELETE CASCADE
        );
      `;

      con.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  static async updateIntegration(
    con: mysql.Connection,
    uuid: number,
    discord?: string,
    line?: string,
    github?: string,
    teams?: string,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      INSERT INTO integration (uuid, discord, line, github, teams)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        discord = VALUES(discord),
        line = COALESCE(VALUES(line), line),
        github = COALESCE(VALUES(github), github),
        teams = COALESCE(VALUES(teams), teams)
    `;

    return new Promise((resolve, reject) => {
      con.query(
        query,
        [uuid, discord || null, line || null, github || null, teams || null],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(BASIC_INFO.SUCCESS_MSG());
          }
        },
      );
    });
  }

  static async getIntegrations(
    con: mysql.Connection,
    uuid: number,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `SELECT * FROM integration WHERE uuid = ?`;

    return new Promise((resolve, reject) => {
      con.query(query, [uuid], (error, results) => {
        if (error) {
          reject(error);
        } else {
          const rows = results as mysql.RowDataPacket[];
          if (rows.length === 0) {
            resolve(
              BASIC_INFO.SUCCESS_MSG("message", "Integrationが存在しません"),
            );
          } else {
            const res = BASIC_INFO.SUCCESS_MSG();
            res.discord = rows[0].discord;
            res.line = rows[0].line;
            res.github = rows[0].github;
            res.teams = rows[0].teams;
            resolve(res);
          }
        }
      });
    });
  }

  //Message-table
  static async createMessageTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS message (
          id INT AUTO_INCREMENT PRIMARY KEY,
          content TEXT NOT NULL,
          sender INT,
          status ENUM('user', 'group'),
          receiver INT,
          FOREIGN KEY (sender) REFERENCES user(uuid) ON DELETE SET NULL
        );
      `;

      con.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  //Response-table
  static async createResponseTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `CREATE TABLE IF NOT EXISTS response (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          message_id INT,
          safety BOOL NOT NULL,
          comment TEXT,
          FOREIGN KEY (user_id) REFERENCES user(uuid) ON DELETE SET NULL,
          FOREIGN KEY (message_id) REFERENCES message(id) ON DELETE SET NULL
        );
      `;

      con.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
