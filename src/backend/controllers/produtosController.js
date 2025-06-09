import pool from "../config/db.js";

export const listarProdutos = async (req, res) => {
  try {
    const [produtos] = await pool.query(`
      SELECT p.*, c.nome AS categoria_nome 
      FROM produtos p
      JOIN categorias c ON p.categoria_id = c.id
    `);
    res.json({ success: true, data: produtos });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar produtos" });
  }
};

export const criarProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade, categoria_id } = req.body;

    const [result] = await pool.query(
      `INSERT INTO produtos 
       (nome, descricao, preco, quantidade, categoria_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [nome, descricao, preco, quantidade, categoria_id]
    );

    const [novoProduto] = await pool.query(
      `SELECT p.*, c.nome AS categoria_nome 
       FROM produtos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Produto criado com sucesso",
      data: novoProduto[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao criar produto" });
  }
};

export const atualizarProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade, categoria_id } = req.body;

    const [result] = await pool.query(
      `UPDATE produtos SET 
       nome = ?, descricao = ?, preco = ?, 
       quantidade = ?, categoria_id = ?
       WHERE id = ?`,
      [nome, descricao, preco, quantidade, categoria_id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    const [produtoAtualizado] = await pool.query(
      `SELECT p.*, c.nome AS categoria_nome 
       FROM produtos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Produto atualizado com sucesso",
      data: produtoAtualizado[0],
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao atualizar produto" });
  }
};

export const deletarProduto = async (req, res) => {
  try {
    const [movimentacoes] = await pool.query(
      "SELECT id FROM movimentacoes WHERE produto_id = ? LIMIT 1",
      [req.params.id]
    );

    if (movimentacoes.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Não é possível excluir produto com movimentações registradas",
      });
    }

    const [result] = await pool.query("DELETE FROM produtos WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erro ao excluir produto",
    });
  }
};
