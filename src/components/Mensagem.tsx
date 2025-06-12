import { useEffect } from "react";

type MensagemProps = {
  tipo: "sucesso" | "erro" | "aviso";
  texto: string;
  onClose: () => void;
};

export default function Mensagem({ tipo, texto, onClose }: MensagemProps) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 4000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`mensagem ${
        tipo === "sucesso" ? "mensagem-sucesso" : "mensagem-erro"
      }`}
    >
      {texto}
    </div>
  );
}
