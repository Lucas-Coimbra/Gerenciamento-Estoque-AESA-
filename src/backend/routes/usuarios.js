import express from "express";
import {
  listarUsuarios,
  obterUsuarioLogado,
  criarUsuario,
  atualizarUsuario,
  alterarSenha,
} from "../controllers/usuariosController.js";
import { authenticate, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/perfil", authenticate, obterUsuarioLogado);

router.get("/", authenticate, isAdmin, listarUsuarios);

router.post("/", authenticate, isAdmin, criarUsuario);

router.put("/:id", authenticate, atualizarUsuario);

router.put("/senha/:id", authenticate, alterarSenha);

export default router;
