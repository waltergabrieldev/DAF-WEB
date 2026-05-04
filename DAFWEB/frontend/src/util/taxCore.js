

// IRPF mensal (tabela 2026 conforme usada no projeto)
export const IRPF_BRACKETS_2026 = [
  { upTo: 2428.8, rate: 0, deduction: 0 },
  { upTo: 2826.65, rate: 0.075, deduction: 182.16 },
  { upTo: 3751.05, rate: 0.15, deduction: 394.16 },
  { upTo: 4664.68, rate: 0.225, deduction: 675.49 },
  { upTo: Infinity, rate: 0.275, deduction: 908.73 },
];

export function round2(x) {
  return Math.round((Number(x) || 0) * 100) / 100;
}

// Calcula IRPF (mensal) ” retorna imposto e alÃ­quota efetiva
export function calcIRPF(base, brackets = IRPF_BRACKETS_2026) {
  const safeBase = Number(base) || 0;
  if (safeBase <= 0) return { imposto: 0, effectiveRate: 0, bracket: null };

  for (const b of brackets) {
    if (safeBase <= b.upTo) {
      const imposto = Math.max(0, safeBase * b.rate - b.deduction);
      const effectiveRate = imposto / safeBase;
      return { imposto: round2(imposto), effectiveRate: round2(effectiveRate), bracket: b };
    }
  }

  return { imposto: 0, effectiveRate: 0, bracket: null };
}

// Simples Nacional - Anexo III
export const SIMPLES_ANEXO_III = [
  { upToAnnual: 180000, rate: 0.06, deduction: 0 },
  { upToAnnual: 360000, rate: 0.112, deduction: 9360 },
  { upToAnnual: 720000, rate: 0.135, deduction: 17640 },
  { upToAnnual: 1800000, rate: 0.16, deduction: 35640 },
  { upToAnnual: 3600000, rate: 0.21, deduction: 125640 },
  { upToAnnual: 4800000, rate: 0.33, deduction: 648000 },
];

// Constantes para calculos PJ
const PROLABORE_PERCENTAGE = 0.28; 
const INSS_RATE = 0.11; 

export function calcSimples(faturamentoMensal, custosMensais) {
  const safeFaturamento = Math.max(0, Number(faturamentoMensal) || 0);
  const safeCustos = Math.min(safeFaturamento, Math.max(0, Number(custosMensais) || 0));

  const receitaAnual = safeFaturamento * 12;
  let faixa = SIMPLES_ANEXO_III[SIMPLES_ANEXO_III.length - 1];
  for (const f of SIMPLES_ANEXO_III) {
    if (receitaAnual <= f.upToAnnual) {
      faixa = f;
      break;
    }
  }

  const impostoAnual = Math.max(0, receitaAnual * faixa.rate - (faixa.deduction || 0));
  const impostoMensal = impostoAnual / 12;

  const prolabore = safeFaturamento * PROLABORE_PERCENTAGE;
  const inss = prolabore * INSS_RATE;

  const baseIR = prolabore - inss;
  const irProlabore = calcIRPF(baseIR);

  const totalImpostos = impostoMensal + inss + irProlabore.imposto;
  const effectiveRate = totalImpostos / (safeFaturamento || 1);

  return {
    impostoMensal: round2(impostoMensal),
    prolabore: round2(prolabore),
    inss: round2(inss),
    irProlabore,
    totalImpostos: round2(totalImpostos),
    effectiveRate: round2(effectiveRate),
    faixa,
  };
}

