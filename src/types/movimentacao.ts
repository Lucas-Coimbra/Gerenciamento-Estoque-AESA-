export interface MovimentacaoType {
  id: number;
  produto_id: number;
  produto: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  usuario_id: number;
  usuario?: string;
  data: string;
  observacao: string;
}

export type NovaMovimentacaoInput = {
  produto_id: number;
  quantidade: number;
  observacao: string;
  tipo: "entrada" | "saida";
};
