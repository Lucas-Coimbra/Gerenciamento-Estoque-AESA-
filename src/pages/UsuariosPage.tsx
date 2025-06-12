import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import type { UsuarioType } from "../types/usuario";
import UsuarioTable from "../components/UsuarioTable";
import UsuarioForm from "../components/UsuarioForm";
import Mensagem from "../components/Mensagem";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioType[]>([]);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro" | "aviso";
    texto: string;
  } | null>(null);
  const [usuarioSelecionado, setUsuarioSelecionado] =
    useState<UsuarioType | null>(null);
  const [exibindoFormulario, setExibindoFormulario] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [temPermissao, setTemPermissao] = useState(false);

  const exibirMensagem = useCallback(
    (tipo: "sucesso" | "erro" | "aviso", texto: string) => {
      setMensagem({ tipo, texto });
    },
    []
  );

  const carregarUsuarios = useCallback(async () => {
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } catch {
      exibirMensagem("erro", "Erro ao carregar usuários");
    }
  }, [exibirMensagem]);

  useEffect(() => {
    const verificarPermissao = async () => {
      try {
        const res = await api.get("/auth/me");
        const usuarioLogado: UsuarioType = res.data;
        if (usuarioLogado.nivel !== "admin") {
          exibirMensagem(
            "aviso",
            "Apenas administradores podem acessar esta página."
          );
          setTemPermissao(false);
        } else {
          setTemPermissao(true);
          await carregarUsuarios();
        }
      } catch {
        exibirMensagem("erro", "Erro ao verificar permissão do usuário.");
      } finally {
        setCarregando(false);
      }
    };

    verificarPermissao();
  }, [carregarUsuarios, exibirMensagem]);

  const handleEditar = (usuario: UsuarioType) => {
    setUsuarioSelecionado(usuario);
    setExibindoFormulario(true);
  };

  const handleNovoUsuario = () => {
    setUsuarioSelecionado(null);
    setExibindoFormulario(true);
  };

  const handleSalvar = async () => {
    setExibindoFormulario(false);
    await carregarUsuarios();
  };

  const handleCancelar = () => {
    setExibindoFormulario(false);
  };

  const handleExcluir = async (id: number) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este usuário?"
    );
    if (!confirmar) return;
    try {
      await api.delete(`/usuarios/${id}`);
      exibirMensagem("sucesso", "Usuário excluído com sucesso");
      await carregarUsuarios();
    } catch {
      exibirMensagem("erro", "Erro ao excluir usuário");
    }
  };

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!temPermissao) {
    return null; // Ou redirecionar: <Navigate to="/home" replace />
  }

  return (
    <div className="usuarios-page">
      <h2>Gerenciamento de Usuários</h2>
      {mensagem && (
        <Mensagem
          tipo={mensagem.tipo}
          texto={mensagem.texto}
          onClose={() => setMensagem(null)}
        />
      )}

      <button onClick={handleNovoUsuario}>Novo Usuário</button>

      {exibindoFormulario && (
        <UsuarioForm
          usuario={usuarioSelecionado}
          onCancel={handleCancelar}
          onSave={handleSalvar}
          exibirMensagem={exibirMensagem}
        />
      )}

      {usuarios.length > 0 ? (
        <UsuarioTable
          usuarios={usuarios}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
        />
      ) : (
        <p>Nenhum usuário encontrado.</p>
      )}
    </div>
  );
}
