import { useEffect, useState } from "react";
import type { ProdutoType } from "../../types/produto";
import type { CategoriaType } from "../../services/categoriaService";
import { categoriaService } from "../../services/categoriaService";

import "./styles.css";

type Props = {
  onSubmit: (produto: ProdutoType) => void;
  initialData: ProdutoType;
};

const ProdutoForm = ({ onSubmit, initialData }: Props) => {
  const [produto, setProduto] = useState<ProdutoType>(initialData);
  const [categorias, setCategorias] = useState<CategoriaType[]>([]);
  const [precoStr, setPrecoStr] = useState(
    initialData.preco.toString().replace(".", ",")
  );

  useEffect(() => {
    categoriaService.listar().then(setCategorias).catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "quantidade" || name === "estoque_minimo") {
      setProduto((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setProduto((prevProduto) => ({
        ...prevProduto,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const precoConvertido = parseFloat(precoStr.replace(",", "."));
    onSubmit({
      ...produto,
      preco: isNaN(precoConvertido) ? 0 : precoConvertido,
    });
  };

  return (
    <form className="produto-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nome</label>
        <input
          type="text"
          name="nome"
          value={produto.nome}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Preço</label>
        <input
          type="text"
          name="preco"
          value={precoStr}
          onChange={(e) => setPrecoStr(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Quantidade</label>
        <input
          type="number"
          name="quantidade"
          value={produto.quantidade}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Estoque Mínimo</label>
        <input
          type="number"
          name="estoque_minimo"
          value={produto.estoque_minimo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Categoria</label>
        <select
          name="categoria_id"
          value={produto.categoria_id || ""}
          onChange={(e) => {
            const idSelecionado = Number(e.target.value);
            const categoriaSelecionada = categorias.find(
              (c) => c.id === idSelecionado
            );
            setProduto({
              ...produto,
              categoria_id: idSelecionado,
              categoria: categoriaSelecionada?.nome || "",
            });
          }}
          required
        >
          <option value="">Selecione...</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-submit">
        Salvar Produto
      </button>
    </form>
  );
};

export default ProdutoForm;
