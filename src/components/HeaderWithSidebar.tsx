import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function HeaderWithSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <input type="checkbox" id="menu-toggle-checkbox" hidden />
      <header className="app-header">
        <div className="header-content">
          <label htmlFor="menu-toggle-checkbox" className="menu-toggle">
            ☰
          </label>
          <h1 className="logo">Estoque AESA</h1>
          <button onClick={handleLogout} className="logout-button">
            Sair
          </button>
        </div>
        <nav className="sidebar">
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/produtos">Produtos</Link>
            </li>
            <li>
              <Link to="/usuario">Usuário</Link>
            </li>
            <li>
              <Link to="/categorias">Categorias</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
