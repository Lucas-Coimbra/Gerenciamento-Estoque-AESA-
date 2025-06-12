import pool from "../config/db.js";

export const listarMovimentacoes = async (req, res) => {
  const { tipo, produto, dataInicio, dataFim } = req.query;

  const filtros = [];
  const valores = [];

  if (tipo) {
    filtros.push("m.tipo = ?");
    valores.push(tipo);
  }

  if (produto) {
    filtros.push("p.nome LIKE ?");
    valores.push(`%${produto}%`);
  }

  if (dataInicio) {
    filtros.push("m.data >= ?");
    valores.push(dataInicio);
  }

  if (dataFim) {
    filtros.push("m.data <= ?");
    valores.push(dataFim);
  }

  const whereClause = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";

  try {
    const [rows] = await pool.query(
      `
      SELECT m.id, m.tipo, m.quantidade, m.data, m.observacao,
             p.nome AS produto, u.nome AS usuario
      FROM movimentacoes m
      JOIN produtos p ON m.produto_id = p.id
      JOIN usuarios u ON m.usuario_id = u.id
      ${whereClause}
      ORDER BY m.data DESC
      `,
      valores
    );

    res.json(rows);
  } catch (error) {
    console.error("Erro ao listar movimentações:", error);
    res.status(500).json({ message: "Erro ao buscar movimentações" });
  }
};

export const criarMovimentacao = async (req, res) => {
  const { produto_id, tipo, quantidade, observacao } = req.body;
  const usuario_id = req.usuario.id;

  if (!produto_id || !tipo || !quantidade) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" });
  }

  if (!["entrada", "saida"].includes(tipo)) {
    return res.status(400).json({ message: "Tipo inválido de movimentação" });
  }

  if (quantidade <= 0) {
    return res
      .status(400)
      .json({ message: "Quantidade deve ser maior que zero" });
  }

  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();

    if (tipo === "saida") {
      const [[produto]] = await conexao.query(
        "SELECT quantidade FROM produtos WHERE id = ?",
        [produto_id]
      );

      if (!produto || produto.quantidade < quantidade) {
        await conexao.rollback();
        return res
          .status(400)
          .json({ message: "Estoque insuficiente para essa saída" });
      }
    }

    const operacao = tipo === "entrada" ? "+" : "-";
    await conexao.query(
      `UPDATE produtos SET quantidade = quantidade ${operacao} ? WHERE id = ?`,
      [quantidade, produto_id]
    );

    await conexao.query(
      `INSERT INTO movimentacoes (produto_id, tipo, quantidade, usuario_id, observacao)
       VALUES (?, ?, ?, ?, ?)`,
      [produto_id, tipo, quantidade, usuario_id, observacao || null]
    );

    await conexao.commit();
    res.status(201).json({ message: "Movimentação registrada com sucesso" });
  } catch (error) {
    await conexao.rollback();
    console.error("Erro ao criar movimentação:", error);
    res.status(500).json({ message: "Erro ao registrar movimentação" });
  } finally {
    conexao.release();
  }
};
