/** Quantil com interpolação linear (mesma convenção do pandas). */
export function quantil(valores, q) {
  const v = [...valores].sort((a, b) => a - b);
  const pos = (v.length - 1) * q;
  const i = Math.floor(pos);
  return v[i] + (v[i + 1] !== undefined ? (pos - i) * (v[i + 1] - v[i]) : 0);
}

/** EAR histórica agrupada pelo mês do ano (1 a 12). */
export function agruparPorMes(serie) {
  const m = {};
  for (const d of serie) (m[Number(d.mes.slice(5))] ??= []).push(d.ear);
  return m;
}

/** Faixa habitual (metade central dos anos) para cada mês do ano. */
export function faixaHabitual(serie) {
  const m = agruparPorMes(serie);
  const f = {};
  for (const k of Object.keys(m)) f[k] = [quantil(m[k], 0.25), quantil(m[k], 0.75)];
  return (ym) => f[Number(ym.slice(5))];
}
