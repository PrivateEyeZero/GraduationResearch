import mysql from "mysql2";

export class SQL {
  private connection: mysql.Connection;

  constructor(
    host: string | undefined,
    user: string | undefined,
    password: string | undefined,
    database: string | undefined,
  ) {
    this.connection = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database,
      bigNumberStrings: true,
    });
  }

  init() {
    this.connection.connect((err) => {
      if (err) {
        console.error("Error connecting to the database:", err);
        return;
      }
      console.log("Connected to the MySQL database.");
    });
    return this.connection;
  }

  getConnection(): mysql.Connection {
    return this.connection;
  }
}
