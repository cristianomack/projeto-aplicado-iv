const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export const num = (v, casas = 1) =>
  Number(v).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

export const pct = (v, casas = 1) => `${num(v, casas)}%`;

/** "2026-11" -> "nov/2026" */
export function mesLongo(ym) {
  const [a, m] = ym.split("-");
  return `${MESES[Number(m) - 1]}/${a}`;
}

/** "2026-11" -> "nov/26" */
export function mesCurto(ym) {
  const [a, m] = ym.split("-");
  return `${MESES[Number(m) - 1]}/${a.slice(2)}`;
}

/** "2026-11" -> "nov" */
export const soMes = (ym) => MESES[Number(ym.split("-")[1]) - 1];

export const fracao = (v) => `${Math.round(v * 100)}%`;
