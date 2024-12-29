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
    await sql_util.createGroupProviderTableIfNotExists(con);
    await sql_util.createMessageTableIfNotExists(con);
    await sql_util.createMessageTargetTableIfNotExists(con);
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

  static async getAllUser(
    con: mysql.Connection,
  ): Promise<{ uuid: number; id: string }[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT uuid, id FROM user;
      `;

      con.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const rows = results as mysql.RowDataPacket[];
          resolve(
            BASIC_INFO.SUCCESS_MSG(
              "members",
              rows.map((row) => ({ uuid: row.uuid, id: row.id })),
            ),
          );
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
            name VARCHAR(32) NOT NULL UNIQUE
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
    name: string,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      INSERT INTO \`group\` (name)
      VALUES (?)
    `;

    return new Promise((resolve, reject) => {
      con.query(query, [name], (error, results) => {
        if (error) {
          resolve(BASIC_INFO.FAILED_MSG("message", error));
        } else {
          const groupId = (results as mysql.OkPacket).insertId;
          const response = BASIC_INFO.SUCCESS_MSG();
          response.group_id = groupId;
          resolve(response);
        }
      });
    });
  }

  static async getGroups(con: mysql.Connection): Promise<RESPONSE_MSG_TYPE> {
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
          const groupIds = rows.map((row) => ({ id: row.id, name: row.name }));
          const res = BASIC_INFO.SUCCESS_MSG();
          res.groups = groupIds;
          resolve(res);
        }
      });
    });
  }

  static async getGroupName(
    con: mysql.Connection,
    group_id: number,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      SELECT name 
      FROM \`group\` 
      WHERE id = ?;
    `;

    return new Promise((resolve, reject) => {
      con.query(query, [group_id], (error, results) => {
        results = results as mysql.RowDataPacket[];
        if (error) {
          resolve(BASIC_INFO.FAILED_MSG("getGroupName", error.message));
        } else {
          if (results.length === 0) {
            resolve(BASIC_INFO.FAILED_MSG("getGroupName", "Group not found"));
          } else {
            const groupName = results[0].name;
            const res = BASIC_INFO.SUCCESS_MSG();
            res.group_name = groupName;
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
    group_name: string,
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
            id: row.id,
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
          const groupNames = rows.map((row) => row.name);
          const res = BASIC_INFO.SUCCESS_MSG();
          res.groupNames = groupNames;
          resolve(res);
        }
      });
    });
  }

  //groupprovider-table
  static async createGroupProviderTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `      
        CREATE TABLE IF NOT EXISTS group_provider (
          id INT AUTO_INCREMENT PRIMARY KEY,
          group_id INT NOT NULL,
          provider VARCHAR(32) NOT NULL,
          role TEXT,
          channel TEXT,
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

  static async getGroupProviderInfo(
    con: mysql.Connection,
    group_id: number,
    provider: string,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      SELECT gp.id, g.name, gp.provider, gp.role, gp.channel
      FROM group_provider gp
      JOIN \`group\` g ON gp.group_id = g.id
      WHERE gp.group_id = ? AND gp.provider = ?
    `;

    return new Promise((resolve, reject) => {
      con.query(query, [group_id, provider], (error, results) => {
        if (error) {
          resolve(BASIC_INFO.FAILED_MSG("Error", error.message));
        } else {
          const rows = results as mysql.RowDataPacket[];
          if (rows.length === 0) {
            resolve(
              BASIC_INFO.FAILED_MSG(
                "Error",
                "指定されたグループプロバイダは存在しません。",
              ),
            );
          } else {
            const row = rows[0];
            const response = BASIC_INFO.SUCCESS_MSG();
            response.role = row.role;
            response.channel = row.channel;
            resolve(response);
          }
        }
      });
    });
  }

  static async addGroupProvider(
    con: mysql.Connection,
    groupId: number,
    provider: string,
    role: string | null = null,
    channel: string | null = null,
  ): Promise<RESPONSE_MSG_TYPE> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO group_provider (group_id, provider, role, channel)
        VALUES (?, ?, ?, ?);
      `;

      const values = [groupId, provider, role, channel];

      con.query(query, values, (error, results) => {
        if (error) {
          reject(BASIC_INFO.FAILED_MSG("message", error.message));
        } else {
          resolve(BASIC_INFO.SUCCESS_MSG());
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
          line VARCHAR(64),
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
    type: "discord" | "line" | "github" | "teams",
    value: string | null,
  ): Promise<RESPONSE_MSG_TYPE> {
    const validTypes = ["discord", "line", "github", "teams"];

    if (!validTypes.includes(type)) {
      throw new Error(`Invalid type: ${type}`);
    }

    // クエリ構築
    const query = `
      INSERT INTO integration (uuid, ${type})
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
      ${type} = VALUES(${type})
    `;

    return new Promise((resolve, reject) => {
      con.query(query, [uuid, value], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(BASIC_INFO.SUCCESS_MSG());
        }
      });
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
          FOREIGN KEY (sender) REFERENCES user(uuid) ON DELETE SET NULL
        );
      `;

      con.query(query, (error, results) => {
        if (error) {
          reject(BASIC_INFO.FAILED_MSG("message", error));
        } else {
          resolve(BASIC_INFO.SUCCESS_MSG());
        }
      });
    });
  }

  static async addMessage(
    con: mysql.Connection,
    content: string,
    sender: number,
  ): Promise<RESPONSE_MSG_TYPE> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO message (content, sender)
        VALUES (?, ?);
      `;

      con.query(query, [content, sender], (error, results: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(BASIC_INFO.SUCCESS_MSG("id", results.insertId));
        }
      });
    });
  }

  static async getAllMessages(
    con: mysql.Connection,
  ): Promise<RESPONSE_MSG_TYPE> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          id AS message_id, 
          content, 
          sender, 
        FROM message;
      `;

      con.query(query, (error, results) => {
        if (error) {
          reject(BASIC_INFO.FAILED_MSG("message", error));
        } else {
          const messages = (results as mysql.RowDataPacket[]).map(
            (row: any) => ({
              message_id: row.message_id,
              content: row.content,
              sender: row.sender,
            }),
          );
          resolve(BASIC_INFO.SUCCESS_MSG("data", messages));
        }
      });
    });
  }

  // Message-target
  static async createMessageTargetTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS message_target (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type ENUM('user', 'group') NOT NULL,
          receiver INT NOT NULL,
          FOREIGN KEY (id) REFERENCES message(id) ON DELETE CASCADE
        );
      `;

      con.query(query, (error, results) => {
        if (error) {
          reject(BASIC_INFO.FAILED_MSG("message_target", error));
        } else {
          resolve(BASIC_INFO.SUCCESS_MSG("message_target table created"));
        }
      });
    });
  }

  static async addMessageTarget(
    con: mysql.Connection,
    messageId: number,
    type: "user" | "group",
    receiver: number,
  ): Promise<RESPONSE_MSG_TYPE> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO message_target (id, type, receiver)
        VALUES (?, ?, ?);
      `;

      con.query(query, [messageId, type, receiver], (error, results: any) => {
        if (error) {
          reject(BASIC_INFO.FAILED_MSG("message_target", error));
        } else {
          resolve(
            BASIC_INFO.SUCCESS_MSG("message_target added", results.insertId),
          );
        }
      });
    });
  }

  static async getMessageTarget(
    con: mysql.Connection,
    messageId: number,
    type?: "user" | "group",
  ): Promise<RESPONSE_MSG_TYPE> {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT receiver, type
        FROM message_target
        WHERE id = ?
      `;

      const params: (number | string)[] = [messageId];

      // type が指定されている場合はクエリを追加
      if (type) {
        query += ` AND type = ?`;
        params.push(type);
      }

      con.query(query, params, (error, results: any) => {
        if (error) {
          reject(BASIC_INFO.FAILED_MSG("getMessageTarget", error));
        } else {
          const targets = results.map(
            (row: { receiver: number; type: string }) => ({
              receiver: row.receiver,
              type: row.type,
            }),
          );
          resolve(BASIC_INFO.SUCCESS_MSG("targets", targets));
        }
      });
    });
  }

  //Response-table
  static async createResponseTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `      
        CREATE TABLE IF NOT EXISTS response (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        message_id INT,
        safety BOOL NOT NULL,
        comment TEXT,
        FOREIGN KEY (user_id) REFERENCES user(uuid) ON DELETE SET NULL,
        FOREIGN KEY (message_id) REFERENCES message(id) ON DELETE SET NULL,
        UNIQUE KEY unique_user_message (user_id, message_id)
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

  static async addResponse(
    con: mysql.Connection,
    user_id: number,
    message_id: number,
    safety: boolean,
    comment: string,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      INSERT INTO response (user_id, message_id, safety, comment)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        safety = VALUES(safety),
        comment = VALUES(comment)
    `;

    return new Promise((resolve, reject) => {
      con.query(
        query,
        [user_id, message_id, safety, comment],
        (error, results) => {
          if (error) {
            resolve(BASIC_INFO.FAILED_MSG("message", error.message));
          } else {
            resolve(BASIC_INFO.SUCCESS_MSG());
          }
        },
      );
    });
  }

  static async getResponse(
    con: mysql.Connection,
    message_id: number,
  ): Promise<any> {
    const query = `
      SELECT user_id, safety, comment
      FROM response
      WHERE message_id = ?
    `;
    message_id = isNaN(message_id) ? -1 : message_id;
    return new Promise((resolve, reject) => {
      con.query(query, [message_id], (error, results) => {
        if (error) {
          reject(BASIC_INFO.FAILED_MSG("message", error.message));
        } else {
          const responseData = (results as mysql.RowDataPacket[]).map(
            (row: any) => ({
              user: row.user_id,
              safety: row.safety,
              comment: row.comment,
            }),
          );
          resolve(BASIC_INFO.SUCCESS_MSG("res", responseData));
        }
      });
    });
  }
}
