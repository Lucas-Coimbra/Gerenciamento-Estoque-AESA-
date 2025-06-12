import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const obterUsuarioLogado = async (req, res) => {
  try {
    const { id, nivel } = req.usuario;

    const [usuarios] = await pool.query(
      "SELECT id, nome, email, nivel, criado_em FROM usuarios WHERE id = ?",
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(usuarios[0]);
  } catch (error) {
    console.error("Erro ao obter usuário logado:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      "SELECT id, nome, email, nivel, criado_em FROM usuarios"
    );
    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, nivel } = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await pool.query(
      "INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)",
      [nome, email, senhaCriptografada, nivel || "operador"]
    );

    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, nivel } = req.body;

    if (req.usuario.id !== Number(id) && req.usuario.nivel !== "admin") {
      return res
        .status(403)
        .json({ message: "Você não tem permissão para editar este usuário" });
    }

    await pool.query(
      "UPDATE usuarios SET nome = ?, email = ?, nivel = ? WHERE id = ?",
      [nome, email, nivel || "operador", id]
    );

    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
};

export const alterarSenha = async (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;

    if (req.usuario.id !== Number(id) && req.usuario.nivel !== "admin") {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const [usuarios] = await pool.query(
      "SELECT senha FROM usuarios WHERE id = ?",
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (req.usuario.nivel !== "admin") {
      const senhaConfere = await bcrypt.compare(senhaAtual, usuarios[0].senha);
      if (!senhaConfere) {
        return res.status(401).json({ message: "Senha atual incorreta" });
      }
    }

    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);

    await pool.query("UPDATE usuarios SET senha = ? WHERE id = ?", [
      novaSenhaCriptografada,
      id,
    ]);

    res.json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({ message: "Erro ao alterar senha" });
  }
};
