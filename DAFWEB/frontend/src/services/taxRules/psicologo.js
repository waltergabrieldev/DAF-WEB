import { calcIRPF, calcSimples, round2 } from "../../util/taxCore.js";

export function createPsicologoRule({ year = 2026 } = {}) {
  return {
    id: "psicologo",
    year,
    compare({ rendaMensal, custosMensais, profissao }) {
      const safeRenda = Math.max(0, Number(rendaMensal) || 0);
      const safeCustos = Math.min(safeRenda, Math.max(0, Number(custosMensais) || 0));

      const irpf = calcIRPF(Math.max(0, safeRenda - safeCustos));
      const simples = calcSimples(safeRenda, safeCustos);

      const inssPF = round2(safeRenda * 0.11); // exemplo de INSS PF
      const liquidoPF = round2(safeRenda - (irpf.imposto + inssPF));
      const liquidoPJ = round2(safeRenda - simples.totalImpostos);

      const simples6PJ = round2(safeRenda * 0.06);

      return {
        input: { rendaMensal: safeRenda, custosMensais: safeCustos, profissao },
        PF: {
          inss: inssPF,
          ir: irpf.imposto,
          isentoIR: irpf.imposto === 0,
          imposto: round2(irpf.imposto + inssPF),
          effectiveRate: irpf.effectiveRate,
          liquido: liquidoPF,
          bracket: irpf.bracket,
        },
        PJ: {
          faturamento: safeRenda,
          impostoMensal: simples.impostoMensal,
          prolabore: simples.prolabore,
          inss: simples.inss,
          irProlabore: simples.irProlabore,
          ir: simples.irProlabore.imposto,
          isentoIR: simples.irProlabore.imposto === 0,
          totalImpostos: simples.totalImpostos,
          effectiveRate: simples.effectiveRate,
          liquido: liquidoPJ,
          faixa: simples.faixa,
          simples6: simples6PJ,
        },
      };
    },
  };
}

