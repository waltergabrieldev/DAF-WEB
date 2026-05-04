import advogado2026 from "./2026/advogado.json";
import { round2 } from "../../util/taxCore.js";

function buildIRFunction({ tabelaIR, reducao }) {
  const brackets = (tabelaIR || []).map((b) => ({
    upTo: b.ate == null ? Infinity : Number(b.ate),
    rate: Number(b.aliquota) || 0,
    deduction: Number(b.deducao) || 0,
  }));

  const hasFormula = Boolean(reducao?.formula);
  let formulaFn = null;
  if (hasFormula) {
    // Permite apenas nÃºmeros, renda e operadores bÃ¡sicos
    const safeExpr = String(reducao.formula).replace(/[^0-9renda+*/().\s-]/gi, "");
    // eslint-disable-next-line no-new-func
    formulaFn = new Function("renda", `return ${safeExpr};`);
  }

  return function calcIR(baseCalculo, renda) {
    const safeBase = Math.max(0, Number(baseCalculo) || 0);
    const safeRenda = Math.max(0, Number(renda) || 0);

    let ir = 0;
    for (const b of brackets) {
      if (safeBase <= b.upTo) {
        ir = Math.max(0, safeBase * b.rate - b.deduction);
        break;
      }
    }

    // Reducao (opcional)
    if (reducao) {
      const limite5000 = 5000;
      const valorAte5000 = Number(reducao.ate5000) || 0;
      const limiteFormula = Number(reducao.limite) || 0;

      if (safeRenda <= limite5000) {
        ir = Math.max(0, ir - valorAte5000);
      } else if (safeRenda <= limiteFormula && formulaFn) {
        const reducaoValor = Number(formulaFn(safeRenda)) || 0;
        ir = Math.max(0, ir - reducaoValor);
      }
    }

    return round2(ir);
  };
}

const calcIR2026 = buildIRFunction(advogado2026.pf);

export function createAdvogadoRule({ year = 2026 } = {}) {
  if (year !== 2026) {
    throw new Error(`Regra de advogado nÃ£o disponÃ­vel para o ano ${year}.`);
  }

  return {
    id: "advogado",
    year,
    compare({ rendaMensal, custosMensais, profissao }) {
      const safeRenda = Math.max(0, Number(rendaMensal) || 0);
      const safeCustos = Math.min(safeRenda, Math.max(0, Number(custosMensais) || 0));

      // PF
      const desconto = Number(advogado2026.pf.descontoSimplificado) || 0;
      const baseCalculoPF = safeRenda - desconto;
      const irPF = calcIR2026(baseCalculoPF, safeRenda);

      const pf = {
        inss: 0,
        ir: irPF,
        isentoIR: irPF === 0,
        imposto: round2(irPF),
        effectiveRate: 0,
        liquido: round2(safeRenda - irPF),
        bracket: null,
      };

      // PJ (config simples)
      const dasRate = Number(advogado2026.pj.das) || 0;
      const DAS = round2(safeRenda * dasRate);
      const proLabore = Math.max(Number(advogado2026.pj.proLaboreMin) || 0, safeRenda * 0.1);
      const inss = round2(proLabore * (Number(advogado2026.pj.inss) || 0));
      const inssPatronal = round2(proLabore * (Number(advogado2026.pj.inssPatronal) || 0));
      const totalImpostos = round2(DAS + inss + inssPatronal);

      const pj = {
        faturamento: safeRenda,
        impostoMensal: DAS,
        prolabore: round2(proLabore),
        inss,
        irProlabore: null,
        ir: 0,
        isentoIR: true,
        totalImpostos,
        effectiveRate: 0,
        liquido: round2(safeRenda - totalImpostos),
        faixa: null,
        // Mantém o campo esperado pelo CompareResult (apesar do nome  não bater com a taxa real)
        simples6: DAS,
      };

      return {
        input: { rendaMensal: safeRenda, custosMensais: safeCustos, profissao },
        PF: pf,
        PJ: pj,
      };
    },
  };
}
