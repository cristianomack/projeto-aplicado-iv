import { mesLongo } from "./format";

/** Número no padrão brasileiro (vírgula decimal), para abrir direto no Excel. */
const br = (v) => (v === null || v === undefined ? "" : String(v).replace(".", ","));

export function baixar(nome, texto, tipo = "text/csv;charset=utf-8") {
  // BOM para o Excel reconhecer UTF-8; ponto e vírgula como separador (padrão do Excel em português)
  const blob = new Blob(["﻿" + texto], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function csvPrevisao(painel) {
  const cab = ["mes", "horizonte_meses", "ear_prevista_pct", "intervalo80_inf_pct", "intervalo80_sup_pct", "risco", "confianca"];
  const linhas = painel.previsao.map((p) =>
    [p.mes, p.horizonte, br(p.ear), br(p.inf), br(p.sup), p.risco, p.confianca].join(";"),
  );
  return [cab.join(";"), ...linhas].join("\r\n");
}

export function csvSerie(painel) {
  const serie = painel.serie_ear ?? painel.historico;
  return ["mes;ear_observada_pct", ...serie.map((d) => `${d.mes};${br(d.ear)}`)].join("\r\n");
}

export function csvBandeiras(painel) {
  const h = painel.bandeira.linha_do_tempo ?? painel.bandeira.historico_alerta ?? [];
  if (!h.length) return null;
  const cols = Object.keys(h[0]);
  return [cols.join(";"), ...h.map((r) => cols.map((c) => br(r[c])).join(";"))].join("\r\n");
}

/** "2026-11-10" -> "10/11/2026" */
export const dataBr = (iso) => (iso ? iso.split("-").reverse().join("/") : "");

export { mesLongo };
