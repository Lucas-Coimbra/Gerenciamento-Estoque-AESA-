export interface UsuarioType {
  id: number;
  nome: string;
  email: string;
  nivel: "admin" | "operador";
}
