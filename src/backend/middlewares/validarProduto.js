export const validarProduto = (req, res, next) => {
  const errors = {};
  const { nome, preco, quantidade, categoria_id } = req.body;

  if (!nome?.trim()) {
    errors.nome = "Nome é obrigatório";
  } else if (nome.trim().length < 3) {
    errors.nome = "Nome deve ter pelo menos 3 caracteres";
  }

  if (!preco || isNaN(preco)) {
    errors.preco = "Preço é obrigatório";
  } else if (preco <= 0) {
    errors.preco = "Preço deve ser maior que zero";
  }

  if (!quantidade && quantidade !== 0) {
    errors.quantidade = "Quantidade é obrigatória";
  } else if (!Number.isInteger(Number(quantidade))) {
    errors.quantidade = "Deve ser um número inteiro";
  } else if (quantidade < 0) {
    errors.quantidade = "Não pode ser negativo";
  }

  if (!categoria_id) {
    errors.categoria_id = "Categoria é obrigatória";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};
