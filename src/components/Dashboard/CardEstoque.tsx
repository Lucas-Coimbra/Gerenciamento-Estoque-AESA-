import "../../styles/global.css";

interface CardEstoqueProps {
  titulo: string;
  valor: string | number;
  tipo?: "normal" | "alerta";
}

export function CardEstoque({
  titulo,
  valor,
  tipo = "normal",
}: CardEstoqueProps) {
  return (
    <div className={`card card-${tipo}`}>
      <h3>{titulo}</h3>
      <p>{valor}</p>
    </div>
  );
}
