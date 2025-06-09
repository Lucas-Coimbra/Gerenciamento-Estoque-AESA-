import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

import produtosRouter from "./routes/produtos.js";
import authRouter from "./routes/authRoutes.js";
import produtoRoutes from "./routes/produtos.js";
import categoriaRoutes from "./routes/categorias.js";

// Configura variáveis de ambiente
config();

const app = express();

// Middlewares globais
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Rotas
app.use("/api/produtos", produtosRouter);
app.use("/api/auth", authRouter);
app.use("/api/produtos", produtoRoutes);
app.use("/api/categorias", categoriaRoutes);

// Rota de verificação de status do servidor
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    database: "MySQL",
    environment: process.env.NODE_ENV || "development",
  });
});

// Middleware global de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Erro interno no servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
