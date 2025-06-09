import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ success: false, message: "Todos os campos são obrigatórios" });
    }

    const [userExists] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (userExists.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const [result] = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, senhaHash]
    );

    const token = generateToken(result.insertId, "operador");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ success: true, message: "Usuário registrado com sucesso" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao registrar usuário" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciais inválidas" });
    }

    const senhaEnviada = senha.trim(); // <- protege contra espaços extras digitados
    const senhaCorreta = await bcrypt.compare(senhaEnviada, users[0].senha);

    if (!senhaCorreta) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciais inválidas" });
    }

    const user = users[0];
    const token = generateToken(user.id, user.nivel);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        nivel: user.nivel,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao realizar login" });
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Não autorizado" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query(
      "SELECT id, nome, email, nivel FROM usuarios WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado" });
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Sessão inválida" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logout realizado com sucesso" });
};

export const verifyAuth = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ authenticated: false });

    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true });
  } catch {
    res.status(401).json({ authenticated: false });
  }
};
