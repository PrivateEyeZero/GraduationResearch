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
  }
  static async createUserTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS user (
          uuid INT AUTO_INCREMENT PRIMARY KEY,
          id VARCHAR(32) NOT NULL UNIQUE,
          pass VARCHAR(32) NOT NULL
        )
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
          admin_role BIGINT,
          user_role BIGINT,
          channel BIGINT
        )
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
    admin_role: bigint,
    user_role: bigint,
    channel: bigint,
  ): Promise<RESPONSE_MSG_TYPE> {
    const query = `
      INSERT INTO \`group\` (name, admin_role, user_role, channel)
      VALUES (?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      con.query(
        query,
        [name, admin_role, user_role, channel],
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
  //Integration-table
  static async createIntegrationTableIfNotExists(
    con: mysql.Connection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS integration (
          uuid INT NOT NULL PRIMARY KEY,
          discord VARCHAR(32),
          Line VARCHAR(32),
          github VARCHAR(32),
          teams VARCHAR(32)
        )
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
      INSERT INTO integration (uuid, discord, Line, github, teams)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        discord = VALUES(discord),
        Line = COALESCE(VALUES(Line), Line),
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
              BASIC_INFO.FAILED_MSG("message", "Integrationが存在しません"),
            );
          } else {
            const res = BASIC_INFO.SUCCESS_MSG();
            res.discord = rows[0].discord;
            res.Line = rows[0].Line;
            res.github = rows[0].github;
            res.teams = rows[0].teams;
            resolve(res);
          }
        }
      });
    });
  }
}
