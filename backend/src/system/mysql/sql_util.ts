import mysql from "mysql2";
import { RESPONSE_MSG_TYPE } from "../../basic_info";

const BASIC_INFO = require("../../basic_info.ts");

export class sql_util{
  //create-table
  static async createAllTablesIfNotExists(con: mysql.Connection): Promise<void> {
    await sql_util.createUserTableIfNotExists(con);
  }
  static async createUserTableIfNotExists(con: mysql.Connection): Promise<void> {
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
  static async addUser(con: mysql.Connection, id: string, pass: string): Promise<RESPONSE_MSG_TYPE> {
    const query = `INSERT INTO user (id, pass) VALUES (?, ?)`;

    return new Promise((resolve, reject) => {
      con.query(query, [id, pass], (error, results) => {
        if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            resolve(BASIC_INFO.FAILED_MSG("message", "IDが既に登録されています"));
          } else {
            resolve(BASIC_INFO.FAILED_MSG("message", error.message));
          }
        } else {
          resolve(BASIC_INFO.SUCCESS_MSG());
        }
      });
    });
  }

  static async authUser(con: mysql.Connection, id: string, pass: string): Promise<RESPONSE_MSG_TYPE> {
    const query = `SELECT * FROM user WHERE id = ? AND pass = ?`;

    return new Promise((resolve, reject) => {
      con.query(query, [id, pass], (error, results) => {
        if (error) resolve(BASIC_INFO.FAILED_MSG("message", error.message));
        const rows = results as mysql.RowDataPacket[];
        if (rows.length === 0) {
          resolve(BASIC_INFO.FAILED_MSG("message", "IDまたはパスワードが違います"));
        } else {
          resolve(BASIC_INFO.SUCCESS_MSG());
        }
      });
    });
  }
}