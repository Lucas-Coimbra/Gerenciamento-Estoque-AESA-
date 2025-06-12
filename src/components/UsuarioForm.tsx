import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { UsuarioType } from "../types/usuario";

type UsuarioFormProps = {
  usuario: UsuarioType | null;
  onCancel: () => void;
  onSave: () => void;
  exibirMensagem: (tipo: "sucesso" | "erro", texto: string) => void;
};

export default function UsuarioForm({
  usuario,
  onCancel,
  onSave,
  exibirMensagem,
}: UsuarioFormProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [nivel, setNivel] = useState("operador");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
      setNivel(usuario.nivel);
    } else {
      setNome("");
      setEmail("");
      setNivel("operador");
      setSenha("");
    }
  }, [usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario && senha.length < 6) {
      exibirMensagem("erro", "A senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      setCarregando(true);

      if (usuario) {
        await api.put(`/usuarios/${usuario.id}`, {
          nome,
          email,
          nivel,
        });
        exibirMensagem("sucesso", "Usuário atualizado com sucesso");
      } else {
        await api.post("/usuarios", {
          nome,
          email,
          nivel,
          senha,
        });
        exibirMensagem("sucesso", "Usuário criado com sucesso");
      }

      onSave();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      exibirMensagem("erro", "Erro ao salvar usuário");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{usuario ? "Editar Usuário" : "Novo Usuário"}</h3>

      <label>Nome:</label>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Nível:</label>
      <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
        <option value="admin">Administrador</option>
        <option value="operador">Operador</option>
      </select>

      {!usuario && (
        <>
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </>
      )}

      <button type="submit" disabled={carregando}>
        {carregando ? "Salvando..." : "Salvar"}
      </button>
      <button type="button" onClick={onCancel} disabled={carregando}>
        Cancelar
      </button>
    </form>
  );
}
