import { useState, useEffect } from "react";
import ProdutoForm from "../components/ProdutoForm";
import ProdutoTable from "../components/ProdutoTable";
import type { ProdutoType } from "../types/produto";
import { produtoService } from "../services/produtoService";
import {
  categoriaService,
  type CategoriaType,
} from "../services/categoriaService";
import "../styles/produtos.css";

export default function ProdutosPage() {
  const [modo, setModo] = useState<"lista" | "form">("lista");
  const [produtoEditando, setProdutoEditando] = useState<ProdutoType | null>(
    null
  );
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [categorias, setCategorias] = useState<CategoriaType[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarProdutosECategorias();
  }, []);

  const carregarProdutosECategorias = async () => {
    try {
      setCarregando(true);
      const [produtosData, categoriasData] = await Promise.all([
        produtoService.listar(),
        categoriaService.listar(),
      ]);

      const produtosComCategoria = produtosData.map((produto) => {
        const cat = categoriasData.find((c) => c.id === produto.categoria_id);
        return {
          ...produto,
          categoria: cat ? cat.nome : "Desconhecida",
        };
      });

      setProdutos(produtosComCategoria);
      setCategorias(categoriasData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setCarregando(false);
    }
  };

  function parsePreco(preco: string | number): number {
    return parseFloat(String(preco).replace(",", "."));
  }

  const handleSubmit = async (produto: ProdutoType) => {
    try {
      const produtoCorrigido = {
        ...produto,
        preco: parsePreco(produto.preco),
        quantidade: Number(produto.quantidade),
      };

      console.log("Salvando produto:", produtoCorrigido);

      if (produtoEditando?.id) {
        await produtoService.atualizar(produtoEditando.id, produtoCorrigido);
      } else {
        await produtoService.criar(produtoCorrigido);
      }

      await carregarProdutosECategorias();
      setModo("lista");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await produtoService.remover(id);
      await carregarProdutosECategorias();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  if (carregando && produtos.length === 0) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="produtos-page__container">
      {modo === "lista" ? (
        <>
          <div className="produtos-page__header">
            <h1>Gerenciamento de Produtos</h1>
            <button
              onClick={() => {
                setProdutoEditando(null);
                setModo("form");
              }}
              className="produtos-page__btn-primary"
            >
              + Novo Produto
            </button>
          </div>
          <ProdutoTable
            produtos={produtos}
            onEdit={setProdutoEditando}
            onDelete={handleDelete}
            onModoChange={setModo}
          />
        </>
      ) : (
        <div className="produtos-page__form-container">
          <button
            onClick={() => setModo("lista")}
            className="produtos-page__btn-voltar"
          >
            ← Voltar para lista
          </button>
          <ProdutoForm
            onSubmit={handleSubmit}
            initialData={
              produtoEditando || {
                id: 0,
                nome: "",
                preco: 0,
                quantidade: 0,
                categoria_id: categorias[0]?.id || 0,
                estoque_minimo: 5,
              }
            }
          />
        </div>
      )}
    </div>
  );
}
