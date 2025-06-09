import "../styles/ConfirmDialog.css";

interface ConfirmDialogProps {
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  visivel: boolean;
}

export default function ConfirmDialog({
  mensagem,
  onConfirmar,
  onCancelar,
  visivel,
}: ConfirmDialogProps) {
  if (!visivel) return null;

  return (
    <div className="confirm-dialog__overlay">
      <div className="confirm-dialog__modal">
        <p>{mensagem}</p>
        <div className="confirm-dialog__buttons">
          <button className="confirm-dialog__btn-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="confirm-dialog__btn-excluir" onClick={onConfirmar}>
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}
