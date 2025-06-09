import { CardEstoque } from "../components/Dashboard/CardEstoque";
import { GraficoResumo } from "../components/Dashboard/GraficoResumo";

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="cards-container">
        <CardEstoque titulo="Produtos em Estoque" valor="150" />
        <CardEstoque titulo="Estoque Baixo" valor="5" tipo="alerta" />
        <CardEstoque titulo="Fornecedores" valor="12" />
      </div>
      <GraficoResumo />
    </div>
  );
}
