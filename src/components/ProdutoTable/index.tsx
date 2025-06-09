import { useState } from "react";
import type { ProdutoType } from "../../types/produto";
import ConfirmDialog from "../ConfirmDialog";
import "./styles.css";

interface ProdutoTableProps {
  produtos: ProdutoType[];
  onEdit: (produto: ProdutoType) => void;
  onDelete: (id: number) => void;
  onModoChange: (modo: "lista" | "form") => void;
}

export default function ProdutoTable({
  produtos,
  onEdit,
  onDelete,
  onModoChange,
}: ProdutoTableProps) {
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [produtoParaExcluir, setProdutoParaExcluir] =
    useState<ProdutoType | null>(null);

  const categorias = [
    "todas",
    ...new Set(
      produtos.map((p) => p.categoria ?? "").filter((cat) => cat !== "")
    ),
  ];

  const produtosFiltrados = produtos.filter((produto) => {
    const buscaMatch = produto.nome.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch =
      filtroCategoria === "todas" || produto.categoria === filtroCategoria;
    return buscaMatch && categoriaMatch;
  });

  return (
    <div className="produtos-table__table-container">
      <div className="produtos-table__filtros">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="produtos-table__search-input"
        />

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="produtos-table__categoria-filter"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <table className="produtos-table__table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>R$ {Number(produto.preco).toFixed(2).replace(".", ",")}</td>
              <td>{produto.quantidade}</td>
              <td>{produto.categoria}</td>
              <td>
                <button
                  onClick={() => {
                    onEdit(produto);
                    onModoChange("form");
                  }}
                  className="produtos-table__btn-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => setProdutoParaExcluir(produto)}
                  className="produtos-table__btn-delete"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        visivel={!!produtoParaExcluir}
        mensagem={
          produtoParaExcluir
            ? `Tem certeza que deseja excluir o produto "${produtoParaExcluir.nome}"?`
            : ""
        }
        onConfirmar={() => {
          if (produtoParaExcluir) {
            onDelete(produtoParaExcluir.id!);
            setProdutoParaExcluir(null);
          }
        }}
        onCancelar={() => setProdutoParaExcluir(null)}
      />
    </div>
  );
}
