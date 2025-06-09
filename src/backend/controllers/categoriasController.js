import pool from "../config/db.js";

export const listarCategorias = async (req, res) => {
  try {
    const [categorias] = await pool.query("SELECT * FROM categorias");
    res.json({ success: true, data: categorias });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar categorias" });
  }
};

export const criarCategoria = async (req, res) => {
  const { nome } = req.body;

  if (!nome?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Nome da categoria é obrigatório",
    });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO categorias (nome) VALUES (?)",
      [nome.trim()]
    );

    const [novaCategoria] = await pool.query(
      "SELECT * FROM categorias WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({ success: true, data: novaCategoria[0] });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao criar categoria" });
  }
};

export const deletarCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.id);

  const idsFixos = [1, 2, 3, 4]; // Eletrônicos, Alimentos, etc.

  if (idsFixos.includes(categoriaId)) {
    return res.status(403).json({
      success: false,
      message: "Esta categoria é protegida e não pode ser excluída",
    });
  }

  try {
    // Verifica se há produtos associados
    const [produtos] = await pool.query(
      "SELECT id FROM produtos WHERE categoria_id = ? LIMIT 1",
      [categoriaId]
    );

    if (produtos.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Não é possível excluir uma categoria associada a produtos",
      });
    }

    const [result] = await pool.query("DELETE FROM categorias WHERE id = ?", [
      categoriaId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erro ao excluir categoria",
    });
  }
};

export const atualizarCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.id);
  const { nome } = req.body;

  if (!nome?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Nome da categoria é obrigatório",
    });
  }

  try {
    const [result] = await pool.query(
      "UPDATE categorias SET nome = ? WHERE id = ?",
      [nome.trim(), categoriaId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
    }

    const [categoriaAtualizada] = await pool.query(
      "SELECT * FROM categorias WHERE id = ?",
      [categoriaId]
    );

    res.json({ success: true, data: categoriaAtualizada[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar categoria",
    });
  }
};
