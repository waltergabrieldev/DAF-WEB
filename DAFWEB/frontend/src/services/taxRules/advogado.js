import advogado2026 from "./2026/adv_pj.json";
import pf2026 from "./2026/pf.json"
import {buildIRFunction} from "./pf.js"
import { round2 } from "../../util/taxCore.js";



const calcIR2026 = buildIRFunction(pf2026.pf);

export function createAdvogadoRule({ year = 2026 } = {}) {
  if (year !== 2026) {
    throw new Error(`Regra de advogado não disponi­vel para o ano ${year}.`);
  }

  return {
    id: "advogado",
    year,
    compare({ rendaMensal, custosMensais, profissao }) {
      const safeRenda = Math.max(0, Number(rendaMensal) || 0);
      const safeCustos = Math.min(safeRenda, Math.max(0, Number(custosMensais) || 0));

      // PF
      const desconto = Number(pf2026.pf.descontoSimplificado) || 0;
      const baseCalculoPF = safeRenda - desconto;
      const irPF = calcIR2026(baseCalculoPF, safeRenda);
      const effectiveRatepf = (irPF/ safeRenda) * 100

      const pf = {
        inss: 0,
        ir: irPF,
        isentoIR: irPF === 0,
        imposto: round2(irPF),
        effectiveRate: effectiveRatepf,
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
      const effectiveRatepj = (totalImpostos/ safeRenda) * 100

      const pj = {
        faturamento: safeRenda,
        impostoMensal: DAS,
        prolabore: round2(proLabore),
        inss,
        irProlabore: null,
        ir: 0,
        isentoIR: true,
        totalImpostos: totalImpostos,
        effectiveRate: effectiveRatepj,
        liquido: round2(safeRenda - totalImpostos),
        faixa: null,
      };

      return {
        input: { rendaMensal: safeRenda, custosMensais: safeCustos, profissao },
        PF: pf,
        PJ: pj,
      };
    },
  };
}
