import { round2 } from "../../util/taxCore.js";
export function buildIRFunction({ tabelaIR, reducao }) {
  const brackets = (tabelaIR || []).map((b) => ({
    upTo: b.ate == null ? Infinity : Number(b.ate),
    rate: Number(b.aliquota) || 0,
    deduction: Number(b.deducao) || 0,
  }));

  const hasFormula = Boolean(reducao?.formula);
  let formulaFn = null;
  if (hasFormula) {
    // Permite apenas números, renda e operadores básicos
    const safeExpr = String(reducao.formula).replace(/[^0-9renda+*/().\s-]/gi, "");
    
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



