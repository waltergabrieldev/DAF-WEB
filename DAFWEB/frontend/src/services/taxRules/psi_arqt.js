import psi_arqt2026 from "./2026/psi_arqt_pj.json";
import pf2026 from "./2026/pf.json";
import { buildIRFunction } from "./pf.js";
import { round2 } from "../../util/taxCore.js";



const calcIR2026 = buildIRFunction(pf2026.pf);

export function createPsi_ArqtRule({ year = 2026 } = {}) {
  if (year !== 2026) {
    throw new Error(`Regra de psicologo não disponi­vel para o ano ${year}.`);
  }

  return {
    id: "psi_arqt",
    year,
    compare({ rendaMensal, custosMensais, profissao }) {
      const safeRenda = Math.max(0, Number(rendaMensal) || 0);
      const safeCustos = Math.min(safeRenda, Math.max(0, Number(custosMensais) || 0));

      // PF
      const desconto = Number(pf2026.pf.descontoSimplificado) || 0;
      const baseCalculoPF = safeRenda - desconto;
      const irPF = calcIR2026(baseCalculoPF, safeRenda);
      const effectiveRate = (totalImpostos / safeRenda) * 100

      const pf = {
        inss: 0,
        ir: irPF,
        isentoIR: irPF === 0,
        imposto: round2(irPF),
        effectiveRate,
        liquido: round2(safeRenda - irPF),
        bracket: null,
      };

      // PJ (config simples)
      const dasRate = Number(psi_arqt2026.pj.das) || 0;
      const DAS = round2(safeRenda * dasRate);
      const proLabore = Math.max(Number(psi_arqt2026.pj.proLaboreMin) || 0, safeRenda * 0.11);
      const inss = round2(proLabore * (Number(psi_arqt2026.pj.inss) || 0));
      const totalImpostos = round2(DAS + inss);

      const pj = {
        faturamento: safeRenda,
        impostoMensal: DAS,
        prolabore: round2(proLabore),
        inss,
        irProlabore: null,
        ir: 0,
        isentoIR: true,
        totalImpostos,
        effectiveRate,
        liquido: round2(safeRenda - totalImpostos),
      };

      return {
        input: { rendaMensal: safeRenda, custosMensais: safeCustos, profissao },
        PF: pf,
        PJ: pj,
      };
    },
  };
}
