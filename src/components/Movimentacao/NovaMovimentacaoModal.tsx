import { useEffect, useState } from "react";
import type { NovaMovimentacaoInput } from "../../types/movimentacao";
import type { ProdutoType } from "../../types/produto";
import { produtoService } from "../../services/produtoService";
import "../../styles/estoque.css";

type NovaMovimentacaoModalProps = {
  tipo: "entrada" | "saida";
  onClose: () => void;
  onSubmit: (data: Omit<NovaMovimentacaoInput, "tipo" | "usuario_id">) => void;
};

const NovaMovimentacaoModal: React.FC<NovaMovimentacaoModalProps> = ({
  tipo,
  onClose,
  onSubmit,
}) => {
  const [produtoId, setProdutoId] = useState(0);
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const lista = await produtoService.listar();
        setProdutos(lista);
        if (lista.length > 0) setProdutoId(lista[0].id || 0);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }

    carregarProdutos();
  }, []);

  const handleSubmit = () => {
    setErro("");

    const produtoSelecionado = produtos.find((p) => p.id === produtoId);

    if (!produtoSelecionado) {
      setErro("Produto inválido.");
      return;
    }

    if (quantidade <= 0) {
      setErro("Quantidade deve ser maior que zero.");
      return;
    }

    if (tipo === "saida" && quantidade > produtoSelecionado.quantidade) {
      setErro("Quantidade informada é maior que o estoque disponível.");
      return;
    }

    onSubmit({
      produto_id: produtoId,
      quantidade,
      observacao,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Nova {tipo === "entrada" ? "Entrada" : "Saída"} de Produto</h2>

        {erro && <p className="erro-msg">{erro}</p>}

        <label>
          Produto:
          <select
            value={produtoId}
            onChange={(e) => setProdutoId(Number(e.target.value))}
          >
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} ({produto.quantidade} em estoque)
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantidade:
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
        </label>

        <label>
          Observação:
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </label>

        <div className="modal-buttons">
          <button className="btn salvar" onClick={handleSubmit}>
            Salvar
          </button>
          <button className="btn cancelar" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NovaMovimentacaoModal;
