import { useState } from "react";
import Backtest from "../components/Backtest";
import EarChart from "../components/EarChart";
import HistoricoBandeira from "../components/HistoricoBandeira";
import Segmentado from "../components/Segmentado";
import { BandeiraPill, RiscoChip } from "../components/ui";
import { REPO_URL } from "../config";
import { fracao, mesLongo, num, pct } from "../format";

const CONF = { boa: "boa", moderada: "moderada", baixa: "baixa" };
const PERIODOS = [
  { valor: 24, texto: "2 anos" },
  { valor: 60, texto: "5 anos" },
  { valor: 0, texto: "Desde 2000" },
];
const HORIZONTES = [
  { valor: 3, texto: "Até 3 meses" },
  { valor: 6, texto: "Até 6 meses" },
];

export default function Tecnico({ painel }) {
  const { situacao, bandeira, avaliacao_teste: aval } = painel;
  const [periodo, setPeriodo] = useState(24);
  const [maxH, setMaxH] = useState(6);

  const serie = painel.serie_ear ?? painel.historico;
  const historico = periodo === 0 ? serie : serie.slice(-periodo);
  const previsao = painel.previsao.filter((p) => p.horizonte <= maxH);
  const prox = previsao[0];
  const menor = previsao.reduce((a, b) => (b.ear < a.ear ? b : a));
  const res = bandeira.resumo_alerta;

  return (
    <main className="pagina-tecnico">
      <header className="topo-tecnico">
        <div>
          <p className="sobretitulo escuro">Projeto Aplicado IV, Painel técnico</p>
          <h1>Previsão da EAR e risco energético-hídrico</h1>
          <p className="regiao escuro">
            {painel.regiao}. Origem da previsão: {mesLongo(painel.origem)} (último mês completo).
          </p>
        </div>
      </header>

      <section className="kpis" aria-label="Indicadores">
        <div className="kpi">
          <p className="rotulo">EAR observada</p>
          <p className="valor">{pct(situacao.ear)}</p>
          <p className="apoio">{mesLongo(situacao.mes)}, % da capacidade</p>
        </div>
        <div className="kpi">
          <p className="rotulo">Previsão para {mesLongo(prox.mes)}</p>
          <p className="valor">{pct(prox.ear)}</p>
          <p className="apoio">Intervalo de 80%: {num(prox.inf)} a {num(prox.sup)}</p>
        </div>
        <div className="kpi">
          <p className="rotulo">Menor EAR prevista em {maxH} meses</p>
          <p className="valor">{pct(menor.ear)}</p>
          <p className="apoio">{mesLongo(menor.mes)}</p>
        </div>
        <div className="kpi">
          <p className="rotulo">Bandeira vigente ({mesLongo(bandeira.vigente.mes)})</p>
          <p className="valor-pill"><BandeiraPill bandeira={bandeira.vigente.bandeira} grande /></p>
          <p className="apoio">Fonte: ANEEL</p>
        </div>
      </section>

      <section className="cartao" aria-labelledby="t-graf">
        <h2 id="t-graf">EAR observada e prevista, 1 a {maxH} meses à frente</h2>
        <div className="controles">
          {painel.serie_ear && <Segmentado rotulo="Histórico" opcoes={PERIODOS} valor={periodo} onChange={setPeriodo} />}
          <Segmentado rotulo="Horizonte da previsão" opcoes={HORIZONTES} valor={maxH} onChange={setMaxH} />
        </div>
        <ul className="legenda-linha">
          <li><i className="tr" style={{ background: "#10222E" }} />Observada</li>
          <li><i className="tr" style={{ background: "#0F6E8C" }} />Previsão (Gradient Boosting)</li>
          <li><i className="tr faixa" />Intervalo de 80%</li>
          <li><i className="tr trac" style={{ borderColor: "#B3761E" }} />Atenção: abaixo do percentil 40 do mês</li>
          <li><i className="tr trac" style={{ borderColor: "#B3261E" }} />Risco alto: abaixo do percentil 20 do mês</li>
        </ul>
        <EarChart historico={historico} previsao={previsao} />
        <p className="apoio">{painel.criterio_risco}. Percentis calculados sobre a EAR do mesmo mês do ano, de 2000 até a origem.</p>
      </section>

      <section className="cartao" aria-labelledby="t-hor">
        <h2 id="t-hor">Previsão e risco por horizonte</h2>
        <div className="rolagem">
          <table>
            <thead>
              <tr>
                <th scope="col">Horizonte</th>
                <th scope="col">Mês</th>
                <th scope="col" className="d">EAR prevista</th>
                <th scope="col" className="d">Intervalo 80%</th>
                <th scope="col">Risco</th>
                <th scope="col">Confiança</th>
                <th scope="col" className="d">RMSE no teste</th>
                <th scope="col" className="d">Cobertura no teste</th>
              </tr>
            </thead>
            <tbody>
              {previsao.map((p) => (
                <tr key={p.mes}>
                  <td>{p.horizonte} {p.horizonte === 1 ? "mês" : "meses"}</td>
                  <td>{mesLongo(p.mes)}</td>
                  <td className="d mono">{pct(p.ear)}</td>
                  <td className="d mono">{num(p.inf)} a {num(p.sup)}</td>
                  <td>
                    <RiscoChip risco={p.risco} curto />
                    {p.incerto && <span className="incerto"> incerto</span>}
                  </td>
                  <td>{CONF[p.confianca]}</td>
                  <td className="d mono">{num(aval.rmse_pp[p.horizonte], 2)} p.p.</td>
                  <td className="d mono">{fracao(aval.cobertura_intervalo[p.horizonte])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="apoio">
          "Incerto" indica que o intervalo de 80% cruza a fronteira entre duas categorias de risco. RMSE e cobertura
          vêm do teste de 01/2022 em diante. Um intervalo de 80% bem calibrado deveria cobrir cerca de 80% dos casos; a
          cobertura cai nos horizontes longos, e por isso a confiança é classificada como boa (70% ou mais), moderada
          (60% a 70%) ou baixa.
        </p>
      </section>

      {painel.backtest && <Backtest painel={painel} />}

      <section className="cartao" aria-labelledby="t-band">
        <h2 id="t-band">Bandeira tarifária: vigente e alerta de mudança</h2>
        <p className="apoio">Modelo escolhido na validação: {res.modelo}.</p>
        <div className="kpis kpis-menor">
          <div className="kpi">
            <p className="rotulo">Mudanças de bandeira acertadas</p>
            <p className="valor">{res.mudancas_acertadas}/{res.mudancas_total}</p>
            <p className="apoio">A persistência acerta {res.persistencia_mudancas_acertadas}/{res.mudancas_total}</p>
          </div>
          <div className="kpi">
            <p className="rotulo">Alarmes falsos</p>
            <p className="valor">{res.alarmes_falsos}/{res.meses_sem_mudanca}</p>
            <p className="apoio">Meses sem mudança em que o modelo avisou mudança</p>
          </div>
        </div>
        <HistoricoBandeira historico={bandeira.historico_alerta_completo ?? bandeira.historico_alerta} />
        <p className="apoio">{bandeira.aviso}</p>
      </section>

      <section className="cartao" aria-labelledby="t-lim">
        <h2 id="t-lim">Limitações</h2>
        <ul className="limites">
          <li>
            A EAR do Sudeste/Centro-Oeste deixou de separar as bandeiras tarifárias a partir de 2022: a participação de
            eólica e solar cresceu e a de térmicas caiu. Por isso o risco hídrico não é convertido em bandeira.
          </li>
          <li>
            Os intervalos de 80% foram calibrados com os erros da validação; no teste, a cobertura cai nos horizontes
            de 4 a 6 meses.
          </li>
          <li>
            A afluência futura (ENA) é desconhecida. Cenários climatológicos de ENA não formam uma faixa probabilística
            calibrada e, por isso, não são usados no painel.
          </li>
          <li>
            Os limites de risco (percentis 20 e 40 do mês) são um critério convencional, não calibrado em custo ou
            desabastecimento.
          </li>
          <li>
            O alerta de mudança de bandeira só é atualizado quando o mês fecha. A persistência da bandeira é um baseline
            difícil de bater, e a diferença do modelo em relação a ela não é conclusiva na avaliação do notebook.
          </li>
          <li>A capacidade de referência da EAR é revisada pelo ONS ao longo do tempo (houve revisão em 2026).</li>
        </ul>
      </section>

      <footer className="rodape">
        <a href="#/">Ver painel público</a>
        <span>
          Fontes: ONS e ANEEL, dados abertos. Código, dados e notebook: <a href={REPO_URL}>repositório no GitHub</a>.
        </span>
      </footer>
    </main>
  );
}
