import { useEffect, useState } from "react";
import type { CategoriaType } from "../services/categoriaService";
import { categoriaService } from "../services/categoriaService";
import "../styles/categorias.css";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<CategoriaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [novaCategoria, setNovaCategoria] = useState("");
  const [erroDuplicado, setErroDuplicado] = useState<string | null>(null);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nomeEditando, setNomeEditando] = useState("");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const data = await categoriaService.listar();
        setCategorias(data);
      } catch {
        setError("Erro ao carregar categorias");
      } finally {
        setLoading(false);
      }
    }
    fetchCategorias();
  }, []);

  function handleAdicionar() {
    const nomeTrim = novaCategoria.trim();
    if (!nomeTrim) return;

    const existe = categorias.some(
      (cat) => cat.nome.toLowerCase() === nomeTrim.toLowerCase()
    );
    if (existe) {
      setErroDuplicado("Categoria já existe");
      return;
    }

    categoriaService
      .criar(nomeTrim)
      .then((novaCat) => {
        setCategorias((old) => [...old, novaCat]);
        setNovaCategoria("");
        setErroDuplicado(null);
      })
      .catch(() => setErroDuplicado("Erro ao criar categoria"));
  }

  function iniciarEdicao(cat: CategoriaType) {
    if (cat.fixa) return;
    setEditandoId(cat.id);
    setNomeEditando(cat.nome);
    setErroDuplicado(null);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNomeEditando("");
    setErroDuplicado(null);
  }

  async function salvarEdicao(id: number) {
    const nomeTrim = nomeEditando.trim();
    if (!nomeTrim) {
      setErroDuplicado("Nome não pode ser vazio");
      return;
    }

    const existe = categorias.some(
      (cat) =>
        cat.nome.toLowerCase() === nomeTrim.toLowerCase() && cat.id !== id
    );
    if (existe) {
      setErroDuplicado("Categoria já existe");
      return;
    }

    try {
      await categoriaService.atualizar(id, nomeTrim);
      setCategorias((old) =>
        old.map((cat) => (cat.id === id ? { ...cat, nome: nomeTrim } : cat))
      );
      cancelarEdicao();
    } catch {
      setErroDuplicado("Erro ao atualizar categoria");
    }
  }

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading)
    return <p className="categorias-carregando">Carregando categorias...</p>;

  return (
    <div className="categorias-page">
      {error && <p className="categoria-erro-msg">{error}</p>}

      <h1 className="categorias-titulo">Categorias</h1>

      <div className="categoria-topo-container">
        <input
          className="categoria-busca-input"
          type="text"
          placeholder="Buscar categoria"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <div className="categoria-nova-container">
          <input
            className={`categoria-nova-input ${
              erroDuplicado ? "input-error" : ""
            }`}
            type="text"
            placeholder="Nova categoria"
            value={novaCategoria}
            onChange={(e) => {
              setNovaCategoria(e.target.value);
              if (erroDuplicado) setErroDuplicado(null);
            }}
          />
          <button className="categoria-nova-btn" onClick={handleAdicionar}>
            Adicionar
          </button>
        </div>
      </div>

      {erroDuplicado && <p className="categoria-erro-msg">{erroDuplicado}</p>}

      <ul className="categorias-lista">
        {categoriasFiltradas.map((cat) => (
          <li key={cat.id} className="categoria-item">
            {editandoId === cat.id ? (
              <>
                <input
                  className={`categoria-editar-input ${
                    erroDuplicado ? "input-error" : ""
                  }`}
                  value={nomeEditando}
                  onChange={(e) => {
                    setNomeEditando(e.target.value);
                    if (erroDuplicado) setErroDuplicado(null);
                  }}
                />
                <button
                  className="categoria-salvar-btn"
                  onClick={() => salvarEdicao(cat.id)}
                >
                  Salvar
                </button>
                <button
                  className="categoria-cancelar-btn"
                  onClick={cancelarEdicao}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span
                  className={`categoria-nome ${
                    cat.fixa ? "categoria-fixa" : "categoria-editavel"
                  }`}
                  title={
                    cat.fixa
                      ? "Categoria fixa não editável"
                      : "Clique para editar"
                  }
                >
                  {cat.nome} {cat.fixa ? "(Fixa)" : ""}
                </span>
                {!cat.fixa && (
                  <>
                    <button
                      className="categoria-editar-btn"
                      onClick={() => iniciarEdicao(cat)}
                    >
                      Editar
                    </button>
                    <button
                      className="categoria-excluir-btn"
                      onClick={async () => {
                        try {
                          await categoriaService.excluirCategoria(cat.id);
                          setCategorias((prev) =>
                            prev.filter((c) => c.id !== cat.id)
                          );
                        } catch {
                          setError("Erro ao excluir categoria");
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
