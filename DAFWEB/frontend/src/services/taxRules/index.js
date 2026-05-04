import { createAdvogadoRule } from "./advogado.js";
import { createPsicologoRule } from "./psicologo.js";

function normalizeProfissao(profissao) {
  return (profissao ?? "").toString().trim().toLowerCase();
}

export function getTaxRule({ profissao, year = 2026 } = {}) {
  const p = normalizeProfissao(profissao);

  if (p.includes("advog")) return createAdvogadoRule({ year });
  // default (inclui "psicologo(a)" / "psicologo")
  return createPsicologoRule({ year });
}
