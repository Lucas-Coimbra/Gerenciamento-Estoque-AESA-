import { useEffect, useState } from "react";
import { CardEstoque } from "../components/Dashboard/CardEstoque";
import { GraficoResumo } from "../components/Dashboard/GraficoResumo";
import { produtoService } from "../services/produtoService";
import type { ProdutoType } from "../types/produto";

export default function DashboardPage() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const data = await produtoService.listar();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }

    carregarProdutos();
  }, []);

  const totalProdutos = produtos.length;
  const estoqueBaixo = produtos.filter(
    (p) => p.quantidade < p.estoque_minimo
  ).length;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="cards-container">
        <CardEstoque titulo="Produtos em Estoque" valor={totalProdutos} />
        <CardEstoque
          titulo="Estoque Baixo"
          valor={estoqueBaixo}
          tipo="alerta"
        />
        <CardEstoque titulo="Fornecedores" valor="12" />
      </div>
      <GraficoResumo />
    </div>
  );
}
