import express from "express";
import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from "../controllers/produtosController.js";
import { validarProduto } from "../middlewares/validarProduto.js";
import { authenticate, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", listarProdutos);
router.post("/", authenticate, isAdmin, validarProduto, criarProduto);
router.put("/:id", validarProduto, atualizarProduto);
router.delete("/:id", deletarProduto);

export default router;
