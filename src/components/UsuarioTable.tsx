import type { UsuarioType } from "../types/usuario";

type UsuarioTableProps = {
  usuarios: UsuarioType[];
  onEditar: (usuario: UsuarioType) => void;
  onExcluir: (usuarioId: number) => void;
};

export default function UsuarioTable({
  usuarios,
  onEditar,
  onExcluir,
}: UsuarioTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Nível</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id}>
            <td>{usuario.nome}</td>
            <td>{usuario.email}</td>
            <td>{usuario.nivel}</td>
            <td>
              <button onClick={() => onEditar(usuario)}>Editar</button>
              <button onClick={() => onExcluir(usuario.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
