import { useMemo, useState } from "react";
import { mesLongo } from "../format";
import { BandeiraPill } from "./ui";
import Segmentado from "./Segmentado";

function resultado(h) {
  if (h.mudou) return h.acertou ? "Mudança antecipada" : "Mudança não antecipada";
  return h.alerta ? "Alarme falso" : "Sem mudança, sem alarme";
}

export default function HistoricoBandeira({ historico }) {
  const anos = useMemo(() => [...new Set(historico.map((h) => h.mes.slice(0, 4)))].sort().reverse(), [historico]);
  const [ano, setAno] = useState("12");
  const [soMudancas, setSoMudancas] = useState(false);

  let linhas = ano === "12" ? historico.slice(-12) : ano === "todos" ? historico : historico.filter((h) => h.mes.startsWith(ano));
  if (soMudancas) linhas = linhas.filter((h) => h.mudou || h.alerta);

  const opcoes = [
    { valor: "12", texto: "Últimos 12 meses" },
    ...anos.map((a) => ({ valor: a, texto: a })),
    { valor: "todos", texto: "Todos" },
  ];

  return (
    <>
      <div className="controles">
        <Segmentado rotulo="Período" opcoes={opcoes} valor={ano} onChange={setAno} />
        <label className="marcador">
          <input type="checkbox" checked={soMudancas} onChange={(e) => setSoMudancas(e.target.checked)} />
          Só meses com mudança ou alarme
        </label>
      </div>
      <p className="apoio" aria-live="polite">{linhas.length} {linhas.length === 1 ? "mês exibido" : "meses exibidos"}.</p>
      <div className="rolagem rolagem-vertical">
        <table>
          <caption className="so-leitor">Bandeira real, mês anterior e previsão do modelo</caption>
          <thead>
            <tr>
              <th scope="col">Mês</th>
              <th scope="col">Mês anterior</th>
              <th scope="col">Previsão do modelo</th>
              <th scope="col">Bandeira real</th>
              <th scope="col">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((h) => (
              <tr key={h.mes}>
                <td>{mesLongo(h.mes)}</td>
                <td><BandeiraPill bandeira={h.anterior} /></td>
                <td><BandeiraPill bandeira={h.modelo} /></td>
                <td><BandeiraPill bandeira={h.real} /></td>
                <td>{resultado(h)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
