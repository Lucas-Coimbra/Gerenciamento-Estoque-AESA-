import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { UsuarioType } from "../types/usuario";
import type { AxiosError } from "axios";
import Mensagem from "../components/Mensagem"; // ajuste o caminho conforme necessário
import "../styles/perfil.css";

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<UsuarioType | null>(null);
  const [editando, setEditando] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro" | "aviso";
    texto: string;
  } | null>(null);

  useEffect(() => {
    api
      .get("/usuarios/perfil")
      .then((res) => setUsuario(res.data))
      .catch(() =>
        setMensagem({ tipo: "erro", texto: "Erro ao carregar dados do perfil" })
      );
  }, []);

  const handleSalvar = async () => {
    if (!usuario) return;
    try {
      await api.put(`/usuarios/${usuario.id}`, {
        nome: usuario.nome,
        email: usuario.email,
      });
      setMensagem({ tipo: "sucesso", texto: "Dados atualizados com sucesso" });
      setEditando(false);
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao atualizar dados" });
    }
  };

  const handleCancelarEdicao = () => {
    setEditando(false);
    api
      .get("/usuarios/perfil")
      .then((res) => setUsuario(res.data))
      .catch(() =>
        setMensagem({
          tipo: "erro",
          texto: "Erro ao recarregar dados",
        })
      );
  };

  const handleAlterarSenha = async () => {
    if (!usuario) return;

    if (novaSenha.length < 6) {
      setMensagem({
        tipo: "aviso",
        texto: "A nova senha deve ter no mínimo 6 caracteres",
      });
      return;
    }

    try {
      await api.put(`/usuarios/senha/${usuario.id}`, {
        senhaAtual,
        novaSenha,
      });
      setMensagem({ tipo: "sucesso", texto: "Senha alterada com sucesso" });
      setSenhaAtual("");
      setNovaSenha("");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setMensagem({
        tipo: "erro",
        texto: error.response?.data?.message || "Erro ao alterar senha",
      });
    }
  };

  if (!usuario) return <p className="perfil-loading">Carregando...</p>;

  return (
    <div className="perfil-page-container">
      {mensagem && (
        <Mensagem
          tipo={mensagem.tipo}
          texto={mensagem.texto}
          onClose={() => setMensagem(null)}
        />
      )}

      <h2 className="perfil-titulo">Meu Perfil</h2>

      <div className="perfil-campo">
        <label className="perfil-label">Nome:</label>
        <input
          type="text"
          value={usuario.nome}
          onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
          disabled={!editando}
          className="perfil-input"
        />
      </div>

      <div className="perfil-campo">
        <label className="perfil-label">Email:</label>
        <input
          type="email"
          value={usuario.email}
          onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
          disabled={!editando}
          className="perfil-input"
        />
      </div>

      <div className="perfil-campo">
        <label className="perfil-label">Nível:</label>
        <input
          type="text"
          value={usuario.nivel}
          disabled
          className="perfil-input"
        />
      </div>
      <div className="perfil-botoes">
        {editando ? (
          <>
            <button className="perfil-btn" onClick={handleSalvar}>
              Salvar
            </button>
            <button
              className="perfil-btn perfil-btn-cancelar"
              onClick={handleCancelarEdicao}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button className="perfil-btn" onClick={() => setEditando(true)}>
            Editar
          </button>
        )}
      </div>

      <hr className="perfil-divisor" />

      <h3 className="perfil-subtitulo">Alterar Senha</h3>
      <input
        type="password"
        placeholder="Senha atual"
        value={senhaAtual}
        onChange={(e) => setSenhaAtual(e.target.value)}
        className="perfil-input"
      />
      <input
        type="password"
        placeholder="Nova senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
        className="perfil-input"
      />
      <button
        className="perfil-btn"
        onClick={handleAlterarSenha}
        disabled={!senhaAtual || !novaSenha}
      >
        Alterar Senha
      </button>
    </div>
  );
}
