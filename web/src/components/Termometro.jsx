import { mesLongo, num, pct } from "../format";
import { agruparPorMes, quantil } from "../stats";
import { RISCO } from "./ui";

/** Onde o nível de hoje está frente ao histórico do mesmo mês do ano. */
export default function Termometro({ serie, situacao }) {
  const ano = Number(situacao.mes.slice(0, 4));
  const mes = situacao.mes.slice(5);
  const hist = agruparPorMes(serie)[Number(mes)];
  const min = Math.min(...hist), max = Math.max(...hist);
  const p20 = quantil(hist, 0.2), p40 = quantil(hist, 0.4), mediana = quantil(hist, 0.5);
  const pos = (v) => `${((v - min) / (max - min)) * 100}%`;
  const largura = (a, b) => `${((b - a) / (max - min)) * 100}%`;

  const idx = serie.findIndex((d) => d.mes === situacao.mes);
  const anterior = serie[idx - 1];
  const anoPassado = serie.find((d) => d.mes === `${ano - 1}-${mes}`);
  const dif = (v) => `${v >= 0 ? "+" : "-"}${num(Math.abs(v))} p.p.`;

  return (
    <div className="termometro">
      <div className="barra" role="img"
        aria-label={`Hoje ${pct(situacao.ear)}. Para este mês, o histórico vai de ${pct(min, 0)} a ${pct(max, 0)}, com mediana de ${pct(mediana, 0)}.`}>
        <span className="zona" style={{ left: 0, width: largura(min, p20), background: RISCO.Alto.bg }} />
        <span className="zona" style={{ left: pos(p20), width: largura(p20, p40), background: RISCO["Atenção"].bg }} />
        <span className="zona" style={{ left: pos(p40), width: largura(p40, max), background: RISCO.Baixo.bg }} />
        <span className="marca-mediana" style={{ left: pos(mediana) }} />
        <span className="marcador-hoje" style={{ left: pos(situacao.ear) }}><b>hoje</b></span>
      </div>
      <div className="escala" aria-hidden="true">
        <span>{pct(min, 0)}</span>
        <span>{pct(max, 0)}</span>
      </div>
      <ul className="legenda-zonas">
        <li><i style={{ background: RISCO.Alto.bg }} />mais baixo que o normal</li>
        <li><i style={{ background: RISCO["Atenção"].bg }} />abaixo do normal</li>
        <li><i style={{ background: RISCO.Baixo.bg }} />normal ou acima</li>
      </ul>
      <p className="apoio">
        Mediana de {mesLongo(situacao.mes).slice(0, 3)} desde 2000: {pct(mediana, 0)}. O traço escuro marca a mediana.
      </p>
      <ul className="comparacoes">
        {anterior && (
          <li>
            <span>Mês anterior ({mesLongo(anterior.mes)})</span>
            <strong>{pct(anterior.ear)}</strong>
            <em>{dif(situacao.ear - anterior.ear)}</em>
          </li>
        )}
        {anoPassado && (
          <li>
            <span>Mesmo mês em {ano - 1}</span>
            <strong>{pct(anoPassado.ear)}</strong>
            <em>{dif(situacao.ear - anoPassado.ear)}</em>
          </li>
        )}
      </ul>
    </div>
  );
}
