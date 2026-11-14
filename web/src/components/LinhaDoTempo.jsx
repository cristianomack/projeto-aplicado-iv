import { mesLongo, soMes } from "../format";
import { BANDEIRA } from "./ui";

export default function LinhaDoTempo({ linha }) {
  const ultimos12 = linha.slice(-12);
  const conta = (b) => ultimos12.filter((m) => m.bandeira === b).length;
  return (
    <>
      <ol className="linha-tempo" aria-label="Bandeira tarifária mês a mês">
        {linha.map((m) => (
          <li key={m.mes} title={`${mesLongo(m.mes)}: ${m.nome_aneel}`}>
            <span className="quad" style={{ background: BANDEIRA[m.bandeira].bg }}>
              <span className="so-leitor">{m.nome_aneel}</span>
            </span>
            <span className="rot">{soMes(m.mes)}</span>
          </li>
        ))}
      </ol>
      <p className="apoio">De {mesLongo(linha[0].mes)} a {mesLongo(linha[linha.length - 1].mes)}.</p>
      <ul className="legenda-linha">
        {["Verde", "Amarela", "Vermelha"].map((b) => (
          <li key={b}><i className="tr" style={{ background: BANDEIRA[b].bg, height: 10 }} />{b}</li>
        ))}
      </ul>
      <p className="apoio">
        Nos últimos 12 meses: {conta("Verde")} {conta("Verde") === 1 ? "mês" : "meses"} verde, {conta("Amarela")} amarela
        e {conta("Vermelha")} vermelha. Vermelha inclui os patamares 1 e 2.
      </p>
    </>
  );
}
