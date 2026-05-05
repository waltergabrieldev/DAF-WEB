import { createAdvogadoRule } from "./advogado.js";
import { createPsi_ArqtRule } from "./psi_arqt.js";

function normalizeProfissao(profissao) {
  return (profissao ?? "").toString().trim().toLowerCase();
}

export function getTaxRule({ profissao, year = 2026 } = {}) {
  const p = normalizeProfissao(profissao);

  if (p.includes("advog")) return createAdvogadoRule({ year });
  // default (inclui "psicologo(a)" / "psicologo")
  return createPsi_ArqtRule({ year });
}
