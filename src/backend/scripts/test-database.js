import pool from "../config/db.js";

async function testDatabase() {
  let connection;
  try {
    // Teste de conexão
    connection = await pool.getConnection();
    console.log("✅ Conexão OK!");

    // Teste de consulta
    const [rows] = await connection.query("SELECT NOW() AS db_time");
    console.log("⏱️ Hora do banco:", rows[0].db_time);

    // Teste de estrutura
    const [tables] = await connection.query(`
      SHOW TABLES LIKE 'produtos'
    `);
    console.log("📦 Tabela produtos existe:", tables.length > 0);
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    if (connection) connection.release();
    await pool.end();
    process.exit();
  }
}

testDatabase();
