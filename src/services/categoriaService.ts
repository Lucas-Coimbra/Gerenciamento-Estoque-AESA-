import { api } from "./api";

export type CategoriaType = {
  id: number;
  nome: string;
  fixa: boolean;
};

type CategoriaRaw = {
  id: number;
  nome: string;
};

const fixasIds = [1, 2, 3, 4];

export const categoriaService = {
  listar: async (): Promise<CategoriaType[]> => {
    const response = await api.get("/categorias");
    return response.data.data.map((cat: CategoriaRaw) => ({
      ...cat,
      fixa: fixasIds.includes(cat.id),
    }));
  },

  criar: async (nome: string): Promise<CategoriaType> => {
    const response = await api.post("/categorias", { nome });
    return response.data.data;
  },

  excluirCategoria: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },

  editar: async (id: number, nome: string): Promise<CategoriaType> => {
    const response = await api.put(`/categorias/${id}`, { nome });
    return response.data.data;
  },

  atualizar: async (id: number, nome: string): Promise<CategoriaType> => {
    const response = await api.put(`/categorias/${id}`, { nome });
    return response.data.data;
  },
};
