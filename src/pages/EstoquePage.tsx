import { useEffect, useState, useCallback } from "react";
import type {
  MovimentacaoType,
  NovaMovimentacaoInput,
} from "../types/movimentacao";
import {
  getMovimentacoes,
  criarMovimentacao,
} from "../services/movimentacaoService";
import NovaMovimentacaoModal from "../components/Movimentacao/NovaMovimentacaoModal";
import "../styles/estoque.css";

const EstoquePage: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalTipo, setModalTipo] = useState<"entrada" | "saida" | null>(null);

  const [filtroTipo, setFiltroTipo] = useState<"" | "entrada" | "saida">("");
  const [filtroProduto, setFiltroProduto] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const movs = await getMovimentacoes({
        tipo: filtroTipo || undefined,
        produto: filtroProduto || undefined,
        dataInicio: filtroDataInicio || undefined,
        dataFim: filtroDataFim || undefined,
      });
      setMovimentacoes(movs);
    } catch (error) {
      console.error("Erro ao carregar movimentações:", error);
    } finally {
      setLoading(false);
    }
  }, [filtroTipo, filtroProduto, filtroDataInicio, filtroDataFim]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleNovaMovimentacao = async (
    data: Omit<NovaMovimentacaoInput, "tipo" | "usuario_id">
  ) => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

      if (!usuario.id) {
        throw new Error("Usuário não encontrado no localStorage.");
      }

      await criarMovimentacao({
        ...data,
        tipo: modalTipo!,
      });

      setModalTipo(null);
      carregarDados();
    } catch (error) {
      console.error("Erro ao criar movimentação:", error);
    }
  };

  return (
    <div className="estoque-container">
      <h1>Movimentações de Estoque</h1>
      <div className="botoes">
        <button className="btn entrada" onClick={() => setModalTipo("entrada")}>
          Nova Entrada
        </button>
        <button className="btn saida" onClick={() => setModalTipo("saida")}>
          Nova Saída
        </button>
      </div>

      <div className="filtros">
        <select
          value={filtroTipo}
          onChange={(e) =>
            setFiltroTipo(e.target.value as "" | "entrada" | "saida")
          }
        >
          <option value="">Todos os Tipos</option>
          <option value="entrada">Entradas</option>
          <option value="saida">Saídas</option>
        </select>

        <input
          type="text"
          placeholder="Filtrar por produto"
          value={filtroProduto}
          onChange={(e) => setFiltroProduto(e.target.value)}
        />

        <input
          type="date"
          value={filtroDataInicio}
          onChange={(e) => setFiltroDataInicio(e.target.value)}
        />

        <input
          type="date"
          value={filtroDataFim}
          onChange={(e) => setFiltroDataFim(e.target.value)}
        />
      </div>

      {modalTipo && (
        <NovaMovimentacaoModal
          tipo={modalTipo}
          onClose={() => setModalTipo(null)}
          onSubmit={handleNovaMovimentacao}
        />
      )}

      {loading ? (
        <p>Carregando movimentações...</p>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela-movimentacoes">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Usuário</th>
                <th>Data</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.produto}</td>
                  <td>{m.tipo}</td>
                  <td>{m.quantidade}</td>
                  <td>{m.usuario}</td>
                  <td>{new Date(m.data).toLocaleString()}</td>
                  <td>{m.observacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EstoquePage;
