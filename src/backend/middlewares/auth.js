import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { config } from "dotenv";

config();

// Middleware para verificar autenticação
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Acesso não autorizado",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica se usuário ainda existe
    const [users] = await pool.query(
      "SELECT id, nivel FROM usuarios WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    req.usuario = users[0];
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Sessão inválida",
    });
  }
};

// Middleware para verificar se é admin
export const isAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.nivel !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Acesso restrito a administradores",
    });
  }
  next();
};
