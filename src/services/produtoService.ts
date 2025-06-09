import { api } from "./api";
import type { ProdutoType } from "../types/produto";

export const produtoService = {
  listar: async (): Promise<ProdutoType[]> => {
    const response = await api.get("/produtos");
    return response.data.data;
  },

  criar: async (produto: ProdutoType): Promise<void> => {
    await api.post("/produtos", {
      nome: produto.nome,
      preco: produto.preco,
      quantidade: produto.quantidade,
      categoria_id: produto.categoria_id,
    });
  },

  atualizar: async (id: number, produto: ProdutoType): Promise<void> => {
    await api.put(`/produtos/${id}`, {
      nome: produto.nome,
      preco: produto.preco,
      quantidade: produto.quantidade,
      categoria_id: produto.categoria_id,
    });
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/produtos/${id}`);
  },
};
