import { getTaxRule } from "../services/taxRules/index.js";
export { calcIRPF, calcSimples, round2, IRPF_BRACKETS_2026, SIMPLES_ANEXO_III } from "./taxCore.js";

/**
 * Função principal que retorna o comparativo PF x PJ
 * Input: rendaMensal (faturamento), custosMensais, profissao (string)
 */
export function compareTaxes({ rendaMensal, custosMensais, profissao }) {
  const profession = (profissao ?? "").toString();
  const safeRenda = Math.max(0, Number(rendaMensal) || 0);
  const safeCustos = Math.min(safeRenda, Math.max(0, Number(custosMensais) || 0));

  const rule = getTaxRule({ profissao: profession, year: 2026 });
  return rule.compare({ rendaMensal: safeRenda, custosMensais: safeCustos, profissao: profession });
}

export function calcular(profissao, renda, custos) {
  return compareTaxes({ profissao, rendaMensal: renda, custosMensais: custos });
}

