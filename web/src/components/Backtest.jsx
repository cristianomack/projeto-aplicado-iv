import { useMemo, useState } from "react";
import { mesCurto, mesLongo, num, pct } from "../format";

const JANELA = 18; // meses de histórico mostrados antes da origem
const SLOTS = 6;   // horizontes

function GraficoBacktest({ hist, origem, previsoes }) {
  const W = 780, H = 300, m = { l: 48, r: 20, t: 18, b: 36 };
  const total = hist.length + SLOTS;
  const nH = hist.length;
  const todos = [
    ...hist.map((d) => d.ear),
    ...previsoes.flatMap((p) => [p.real, p.gb, p.inf, p.sup, p.sazonal]),
  ];
  const piso = Math.max(0, Math.floor((Math.min(...todos) - 4) / 10) * 10);
  const teto = Math.min(100, Math.ceil((Math.max(...todos) + 4) / 10) * 10);
  const x = (i) => m.l + (i / (total - 1)) * (W - m.l - m.r);
  const y = (v) => m.t + ((teto - v) / (teto - piso)) * (H - m.t - m.b);
  const linha = (pts) => pts.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join(" ");

  const o = [x(nH - 1), y(hist[nH - 1].ear)];
  const pos = (p) => x(nH - 1 + p.horizonte);
  const obs = hist.map((d, i) => [x(i), y(d.ear)]);
  const realApos = [o, ...previsoes.map((p) => [pos(p), y(p.real)])];
  const gb = [o, ...previsoes.map((p) => [pos(p), y(p.gb)])];
  const saz = [o, ...previsoes.map((p) => [pos(p), y(p.sazonal)])];
  const sup = [o, ...previsoes.map((p) => [pos(p), y(p.sup)])];
  const inf = [o, ...previsoes.map((p) => [pos(p), y(p.inf)])].reverse();
  const faixa = `${linha(sup)} ${linha(inf).replace("M", "L")} Z`;

  const grade = [];
  for (let v = piso; v <= teto; v += 10) grade.push(v);
  const meses = [...hist.map((d) => d.mes)];
  const rotulos = [];
  for (let i = 0; i < nH; i += 4) rotulos.push([x(i), mesCurto(meses[i])]);
  const alvoFinal = previsoes[previsoes.length - 1];
  if (alvoFinal) rotulos.push([pos(alvoFinal), mesCurto(alvoFinal.mes)]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="grafico"
      aria-label={`Previsão feita em ${mesLongo(origem)} comparada com o que ocorreu depois.`}>
      {grade.map((v) => (
        <g key={v}>
          <line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} stroke="#E1E9ED" />
          <text x={m.l - 8} y={y(v) + 4} textAnchor="end" className="eixo">{v}</text>
        </g>
      ))}
      <line x1={o[0]} x2={o[0]} y1={m.t} y2={H - m.b} stroke="#9FB3BD" strokeDasharray="2 3" />
      <path d={faixa} fill="#BFDCE8" fillOpacity="0.75" />
      <path d={linha(saz)} fill="none" stroke="#7F8E97" strokeWidth="2" strokeDasharray="5 4" />
      <path d={linha(obs)} fill="none" stroke="#10222E" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linha(realApos)} fill="none" stroke="#10222E" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linha(gb)} fill="none" stroke="#0F6E8C" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={o[0]} cy={o[1]} r="5" fill="#10222E" />
      {previsoes.map((p) => (
        <g key={p.horizonte}>
          <circle cx={pos(p)} cy={y(p.gb)} r="4.5" fill="#FFFFFF" stroke="#0F6E8C" strokeWidth="2.5" />
          <circle cx={pos(p)} cy={y(p.real)} r="3.5" fill="#10222E" />
        </g>
      ))}
      {rotulos.map(([px, t], i) => (
        <text key={i} x={px} y={H - 12} textAnchor="middle" className="eixo">{t}</text>
      ))}
      <text x={o[0]} y={m.t - 4} textAnchor="middle" className="eixo-sans">origem</text>
    </svg>
  );
}

export default function Backtest({ painel }) {
  const origens = useMemo(
    () => painel.backtest.origens.filter((o) => o.previsoes.some((p) => p.horizonte === 1)),
    [painel],
  );
  // origem padrão: a mais recente com os 6 horizontes já observados
  const padrao = useMemo(() => {
    const completas = origens.filter((o) => o.previsoes.length === SLOTS);
    return (completas[completas.length - 1] ?? origens[origens.length - 1]).origem;
  }, [origens]);
  const [sel, setSel] = useState(padrao);
  const idx = origens.findIndex((o) => o.origem === sel);
  const atual = origens[idx];

  const serie = painel.serie_ear;
  const hist = useMemo(() => {
    const fim = serie.findIndex((d) => d.mes === atual.origem);
    return serie.slice(Math.max(0, fim - JANELA + 1), fim + 1);
  }, [serie, atual]);

  const linhas = atual.previsoes.map((p) => ({
    ...p,
    dentro: p.real >= p.inf && p.real <= p.sup,
    erroGb: Math.abs(p.real - p.gb),
    erroSaz: Math.abs(p.real - p.sazonal),
  }));
  const mae = (campo) => linhas.reduce((s, l) => s + l[campo], 0) / linhas.length;
  const dentro = linhas.filter((l) => l.dentro).length;

  return (
    <section className="cartao" aria-labelledby="t-bt">
      <h2 id="t-bt">Voltar no tempo: o que o modelo previa</h2>
      <p className="apoio">
        Escolha um mês de origem e veja a previsão que o modelo teria feito naquela data, usando só dados conhecidos
        até ali, contra o que realmente aconteceu. É a avaliação do teste, mês a mês.
      </p>

      <div className="controles">
        <div className="controle">
          <label className="controle-rotulo" htmlFor="sel-origem">Mês de origem</label>
          <div className="seletor">
            <button type="button" aria-label="Origem anterior" disabled={idx === 0} onClick={() => setSel(origens[idx - 1].origem)}>◀</button>
            <select id="sel-origem" value={sel} onChange={(e) => setSel(e.target.value)}>
              {origens.map((o) => (
                <option key={o.origem} value={o.origem}>{mesLongo(o.origem)}</option>
              ))}
            </select>
            <button type="button" aria-label="Próxima origem" disabled={idx === origens.length - 1} onClick={() => setSel(origens[idx + 1].origem)}>▶</button>
          </div>
        </div>
      </div>

      <ul className="legenda-linha">
        <li><i className="tr" style={{ background: "#10222E" }} />Observada (o que aconteceu)</li>
        <li><i className="tr" style={{ background: "#0F6E8C" }} />Previsão do modelo</li>
        <li><i className="tr faixa" />Intervalo de 80%</li>
        <li><i className="tr trac" style={{ borderColor: "#7F8E97" }} />Baseline sazonal</li>
      </ul>
      <GraficoBacktest hist={hist} origem={atual.origem} previsoes={atual.previsoes} />

      <p className="apoio">
        Origem em {mesLongo(atual.origem)} (EAR de {pct(atual.ear_origem)}). Erro médio absoluto nesta origem:{" "}
        <strong>{num(mae("erroGb"))} p.p.</strong> do modelo contra <strong>{num(mae("erroSaz"))} p.p.</strong> do
        baseline sazonal. O valor real ficou dentro do intervalo de 80% em {dentro} de {linhas.length} {linhas.length === 1 ? "horizonte" : "horizontes"}.
        {linhas.length < SLOTS && " Horizontes mais longos ainda não têm valor observado."}
      </p>

      <div className="rolagem">
        <table>
          <caption className="so-leitor">Previsão e valor observado por horizonte, para a origem escolhida</caption>
          <thead>
            <tr>
              <th scope="col">Horizonte</th>
              <th scope="col">Mês</th>
              <th scope="col" className="d">Observada</th>
              <th scope="col" className="d">Modelo</th>
              <th scope="col" className="d">Intervalo 80%</th>
              <th scope="col">Dentro?</th>
              <th scope="col" className="d">Erro do modelo</th>
              <th scope="col" className="d">Erro do baseline</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.horizonte}>
                <td>{l.horizonte} {l.horizonte === 1 ? "mês" : "meses"}</td>
                <td>{mesLongo(l.mes)}</td>
                <td className="d mono">{pct(l.real)}</td>
                <td className="d mono">{pct(l.gb)}</td>
                <td className="d mono">{num(l.inf)} a {num(l.sup)}</td>
                <td>{l.dentro ? "sim" : "não"}</td>
                <td className="d mono">{num(l.erroGb)} p.p.</td>
                <td className="d mono">{num(l.erroSaz)} p.p.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
