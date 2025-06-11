import { api } from "./api";
import type {
  MovimentacaoType,
  NovaMovimentacaoInput,
} from "../types/movimentacao";

// Agora aceita filtros opcionais
export async function getMovimentacoes(filtros?: {
  tipo?: string;
  produto?: string;
  dataInicio?: string;
  dataFim?: string;
}): Promise<MovimentacaoType[]> {
  const params = new URLSearchParams();

  if (filtros?.tipo) params.append("tipo", filtros.tipo);
  if (filtros?.produto) params.append("produto", filtros.produto);
  if (filtros?.dataInicio) params.append("dataInicio", filtros.dataInicio);
  if (filtros?.dataFim) params.append("dataFim", filtros.dataFim);

  const res = await api.get(`/movimentacoes?${params.toString()}`);
  return res.data;
}

export async function criarMovimentacao(
  data: NovaMovimentacaoInput
): Promise<MovimentacaoType> {
  const res = await api.post("/movimentacoes", data);
  return res.data;
}
