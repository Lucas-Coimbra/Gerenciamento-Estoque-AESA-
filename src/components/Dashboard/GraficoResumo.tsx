import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const dadosMock = [
  { mes: "Jan", entradas: 120, saidas: 60 },
  { mes: "Fev", entradas: 90, saidas: 110 },
  { mes: "Mar", entradas: 150, saidas: 80 },
  { mes: "Abr", entradas: 130, saidas: 95 },
  { mes: "Mai", entradas: 100, saidas: 50 },
];

export function GraficoResumo() {
  return (
    <div className="grafico-container p-4 bg-white rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Resumo Mensal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={dadosMock}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="entradas" fill="#4ade80" name="Entradas" />
          <Bar dataKey="saidas" fill="#f87171" name="Saídas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
