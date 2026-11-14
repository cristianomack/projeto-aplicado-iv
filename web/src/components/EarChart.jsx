import { useState } from "react";
import { mesCurto, mesLongo, pct } from "../format";
import useLargura, { dimensoes } from "./useLargura";
import { RISCO } from "./ui";

/**
 * Série da EAR: histórico observado, previsão com faixa de 80% e, na versão completa,
 * limites de risco do mês-alvo. SVG puro, sem biblioteca de gráficos.
 */
export default function EarChart({ historico, previsao, compacto = false, normal = null, limites = true }) {
  const [caixa, largura] = useLargura();
  const [sel, setSel] = useState(null);
  const d = dimensoes(largura);
  const W = compacto ? 320 : d.W;
  const H = compacto ? 96 : d.H;
  const m = compacto ? { l: 6, r: 6, t: 16, b: 20 } : d.m;
  const nH = historico.length;
  const nF = previsao.length;
  const total = nH + nF;

  const valores = [
    ...(normal ? [...historico, ...previsao].flatMap((d) => normal(d.mes)) : []),
    ...historico.map((d) => d.ear),
    ...previsao.flatMap((d) => [d.inf, d.sup, ...(compacto || !limites ? [] : [d.limite_alto, d.limite_atencao])]),
  ];
  const piso = Math.max(0, Math.floor((Math.min(...valores) - 4) / 10) * 10);
  const teto = Math.min(100, Math.ceil((Math.max(...valores) + 4) / 10) * 10);

  const x = (i) => m.l + (i / (total - 1)) * (W - m.l - m.r);
  const y = (v) => m.t + ((teto - v) / (teto - piso)) * (H - m.t - m.b);
  const linha = (pts) => pts.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join(" ");

  const obs = historico.map((d, i) => [x(i), y(d.ear)]);
  const ultimo = historico[nH - 1];
  const origem = [x(nH - 1), y(ultimo.ear)];
  const prev = [origem, ...previsao.map((d, i) => [x(nH + i), y(d.ear)])];
  const sup = [origem, ...previsao.map((d, i) => [x(nH + i), y(d.sup)])];
  const inf = [origem, ...previsao.map((d, i) => [x(nH + i), y(d.inf)])].reverse();
  const faixa = `${linha(sup)} ${linha(inf).replace("M", "L")} Z`;

  let faixaNormal = null;
  if (normal) {
    const meses = Array.from({ length: total }, (_, i) => (i < nH ? historico[i].mes : previsao[i - nH].mes));
    const lo = meses.map((mm, i) => [x(i), y(normal(mm)[0])]);
    const hi = meses.map((mm, i) => [x(i), y(normal(mm)[1])]).reverse();
    faixaNormal = `${linha(lo)} ${linha(hi).replace("M", "L")} Z`;
  }

  const lim = (chave) => linha(previsao.map((d, i) => [x(nH + i), y(d[chave])]));

  const mes = (i) => (i < nH ? historico[i].mes : previsao[i - nH].mes);
  const rotulosX = [];
  if (compacto) {
    for (let i = 0; i < total; i += Math.ceil(total / 3)) rotulosX.push(i);
  } else if (total > 40) {
    // vários anos: um rótulo por ano (janeiro), espaçados para não se sobreporem
    const maxRot = Math.max(3, Math.floor((W - m.l - m.r) / 54));
    const anos = total / 12;
    const passoAnos = [1, 2, 5, 10].find((p) => anos / p <= maxRot) ?? 10;
    for (let i = 0; i < total; i++) if (mes(i).endsWith("-01") && Number(mes(i).slice(0, 4)) % passoAnos === 0) rotulosX.push(i);
  } else {
    const passo = total > 28 ? 6 : 4;
    for (let i = 0; i < total; i += passo) rotulosX.push(i);
    if (!rotulosX.includes(total - 1) && total - 1 - rotulosX[rotulosX.length - 1] > 2) rotulosX.push(total - 1);
  }
  const rotuloX = (i) => (total > 40 && !compacto ? mes(i).slice(0, 4) : mesCurto(mes(i)));
  const grade = [];
  for (let v = piso; v <= teto; v += 10) grade.push(v);

  const aoMover = (e) => {
    if (compacto) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - m.l) / (W - m.l - m.r)) * (total - 1));
    setSel(Math.max(0, Math.min(total - 1, i)));
  };
  const ponto = sel === null ? null : sel < nH ? historico[sel] : previsao[sel - nH];
  const ehPrev = sel !== null && sel >= nH;
  const faixaN = ponto && normal ? normal(ponto.mes) : null;
  const xs = sel === null ? 0 : x(sel);
  const dica = ponto && (
    <div className="dica" style={{ left: xs, top: m.t, transform: xs > W * 0.55 ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}>
      <strong>{mesLongo(ponto.mes)}</strong>
      <span className="dica-valor">
        {ehPrev ? "Previsão" : "Observada"}: <b>{pct(ponto.ear)}</b>
      </span>
      {ehPrev && <span>Faixa provável: {pct(ponto.inf, 0)} a {pct(ponto.sup, 0)}</span>}
      {faixaN && <span>Faixa habitual: {pct(faixaN[0], 0)} a {pct(faixaN[1], 0)}</span>}
      {ehPrev && <span>Risco: {RISCO[ponto.risco].curto}{ponto.confianca === "baixa" ? " (baixa confiança)" : ""}</span>}
    </div>
  );

  const resumo = `Energia armazenada: ${pct(ultimo.ear)} em ${mesCurto(ultimo.mes)}; previsão de ${pct(previsao[0].ear)} em ${mesCurto(previsao[0].mes)} e ${pct(previsao[nF - 1].ear)} em ${mesCurto(previsao[nF - 1].mes)}.`;

  return (
    <div ref={caixa} className="grafico-caixa">
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={resumo} className={compacto ? "grafico" : "grafico interativo"}
      onPointerMove={aoMover} onPointerDown={aoMover} onPointerLeave={() => setSel(null)}>
      {!compacto &&
        grade.map((v) => (
          <g key={v}>
            <line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} stroke="#E1E9ED" />
            <text x={m.l - 6} y={y(v) + 4} textAnchor="end" className="eixo">
              {v}
            </text>
          </g>
        ))}

      <line x1={origem[0]} x2={origem[0]} y1={m.t} y2={H - m.b} stroke="#9FB3BD" strokeDasharray="2 3" />
      {faixaNormal && <path d={faixaNormal} fill="#DDE6EA" fillOpacity="0.8" />}
      <path d={faixa} fill="#BFDCE8" fillOpacity="0.75" />
      {!compacto && limites && (
        <>
          <path d={lim("limite_atencao")} fill="none" stroke="#B3761E" strokeWidth="1.5" strokeDasharray="5 4" />
          <path d={lim("limite_alto")} fill="none" stroke="#B3261E" strokeWidth="1.5" strokeDasharray="5 4" />
        </>
      )}
      <path d={linha(obs)} fill="none" stroke="#10222E" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linha(prev)} fill="none" stroke="#0F6E8C" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={origem[0]} cy={origem[1]} r="5" fill="#10222E" />
      {!compacto &&
        previsao.map((d, i) => (
          <circle key={d.mes} cx={x(nH + i)} cy={y(d.ear)} r="4.5" fill="#FFFFFF"
            stroke={RISCO[d.risco].traco} strokeWidth="2.5" opacity={d.confianca === "baixa" ? 0.7 : 1} />
        ))}

      {rotulosX.map((i) => (
        <text key={i} x={x(i)} y={H - (compacto ? 4 : d.estreito ? 8 : 12)} textAnchor={i === 0 && total <= 40 ? "start" : i >= total - 2 ? "end" : "middle"}
          className="eixo">
          {rotuloX(i)}
        </text>
      ))}
      <text x={origem[0]} y={m.t - 4} textAnchor="middle" className="eixo-sans">
        hoje
      </text>
      {ponto && (
        <g pointerEvents="none">
          <line x1={xs} x2={xs} y1={m.t} y2={H - m.b} stroke="#10222E" strokeWidth="1" />
          <circle cx={xs} cy={y(ponto.ear)} r="5.5" fill="#FFFFFF" stroke={ehPrev ? "#0F6E8C" : "#10222E"} strokeWidth="3" />
        </g>
      )}
    </svg>
    {dica}
    </div>
  );
}