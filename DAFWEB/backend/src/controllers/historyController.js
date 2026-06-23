import prisma from '../prismaClient.js';

const toNumber = (value) => Number(value);

const formatComparison = (comparison) => ({
  id: comparison.id,
  userId: comparison.user_id,
  rendaMensal: toNumber(comparison.renda_mensal),
  custosMensais: toNumber(comparison.custos_mensais),
  result: comparison.resultado_json,
  createdAt: comparison.created_at,
});

export const createHistory = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const rendaMensal = Number(req.body.rendaMensal);
    const custosMensais = Number(req.body.custosMensais);
    const result = req.body.result;

    if (!Number.isFinite(rendaMensal) || rendaMensal <= 0) {
      return res.status(400).json({ error: 'Renda mensal invalida' });
    }

    if (!Number.isFinite(custosMensais) || custosMensais < 0) {
      return res.status(400).json({ error: 'Custos mensais invalidos' });
    }

    if (!result || typeof result !== 'object') {
      return res.status(400).json({ error: 'Resultado da simulacao e obrigatorio' });
    }

    const comparison = await prisma.comparisons.create({
      data: {
        user_id: userId,
        renda_mensal: rendaMensal,
        custos_mensais: custosMensais,
        resultado_json: result,
      },
    });

    res.status(201).json({ history: formatComparison(comparison) });
  } catch (err) {
    console.error('Erro ao salvar historico:', err);
    res.status(500).json({ error: 'Erro ao salvar historico' });
  }
};

export const listHistory = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const comparisons = await prisma.comparisons.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    res.json({ history: comparisons.map(formatComparison) });
  } catch (err) {
    console.error('Erro ao buscar historico:', err);
    res.status(500).json({ error: 'Erro ao buscar historico' });
  }
};

export const deleteHistoryItem = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Historico invalido' });
    }

    const deleted = await prisma.comparisons.deleteMany({
      where: {
        id,
        user_id: userId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: 'Historico nao encontrado' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Erro ao remover historico:', err);
    res.status(500).json({ error: 'Erro ao remover historico' });
  }
};
