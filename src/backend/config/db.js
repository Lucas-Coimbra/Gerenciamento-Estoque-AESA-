import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "estoque_user",
  password: "SenhaSegura123@",
  database: "estoque_aesa",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
