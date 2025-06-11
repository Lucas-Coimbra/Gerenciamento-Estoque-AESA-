import express from "express";
import {
  listarMovimentacoes,
  criarMovimentacao,
} from "../controllers/movimentacoesController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, listarMovimentacoes);
router.post("/", authenticate, criarMovimentacao);

export default router;
