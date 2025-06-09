import express from "express";
import { authenticate, isAdmin } from "../middlewares/auth.js";
import {
  listarCategorias,
  criarCategoria,
  deletarCategoria,
  atualizarCategoria,
} from "../controllers/categoriasController.js";

const router = express.Router();

router.get("/", listarCategorias);
router.post("/", authenticate, isAdmin, criarCategoria);
router.delete("/:id", authenticate, isAdmin, deletarCategoria);
router.put("/:id", authenticate, isAdmin, atualizarCategoria);

export default router;
