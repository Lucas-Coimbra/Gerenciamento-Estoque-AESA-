export interface ProdutoType {
  id?: number;
  nome: string;
  preco: number | string;
  quantidade: number;
  categoria_id: number;
  categoria?: string;
  estoque_minimo: number;
}
