import { useMemo, useState } from "react";
import Calculadora from "../components/Calculadora";
import EarChart from "../components/EarChart";
import Faq from "../components/Faq";
import LinhaDoTempo from "../components/LinhaDoTempo";
import PrevisaoMeses from "../components/PrevisaoMeses";
import Segmentado from "../components/Segmentado";
import Termometro from "../components/Termometro";
import { BandeiraPill, RISCO, Semaforo } from "../components/ui";
import { mesLongo, pct } from "../format";
import { faixaHabitual } from "../stats";

const FRASE = { Baixo: "Tranquila", "Atenção": "Atenção", Alto: "Risco alto" };
const PERIODOS = [
  { valor: 12, texto: "12 meses" },
  { valor: 60, texto: "5 anos" },
];

export default function Publico({ painel }) {
  const { situacao, previsao, bandeira, avaliacao_teste: aval } = painel;
  const serie = painel.serie_ear ?? painel.historico;
  const [periodo, setPeriodo] = useState(12);
  const normal = useMemo(() => (painel.serie_ear ? faixaHabitual(painel.serie_ear) : null), [painel]);
  const baixaConfianca = previsao.filter((p) => p.confianca === "baixa").map((p) => p.horizonte);

  return (
    <main className="pagina-publico">
      <header className="topo">
        <div className="miolo">
          <p className="sobretitulo">Do reservatório à conta de luz</p>
          <h1>Como estão os reservatórios da sua região</h1>
          <p className="regiao">{painel.regiao}</p>
        </div>
      </header>

      <div className="miolo colunas">
      <div className="col">

      <section className="cartao" aria-labelledby="p-sit">
        <div className="situacao">
          <Semaforo risco={situacao.risco} />
          <div>
            <p className="rotulo">Situação hoje</p>
            <h2 id="p-sit">{FRASE[situacao.risco]}</h2>
            <p>Os reservatórios estão com {pct(situacao.ear, 0)} da capacidade ({mesLongo(situacao.mes)}).</p>
          </div>
        </div>
        {painel.serie_ear && (
          <>
            <h3 className="sub">Como está comparado ao normal</h3>
            <Termometro serie={painel.serie_ear} situacao={situacao} />
          </>
        )}
      </section>

      <section className="cartao" aria-labelledby="p-evo">
        <h2 id="p-evo" className="rotulo-h">Evolução e previsão dos próximos 6 meses</h2>
        <Segmentado rotulo="Período" opcoes={PERIODOS} valor={periodo} onChange={setPeriodo} />
        <EarChart historico={serie.slice(-periodo)} previsao={previsao} normal={normal} limites={false} />
        <ul className="legenda-linha">
          <li><i className="tr" style={{ background: "#10222E" }} />Observada</li>
          <li><i className="tr" style={{ background: "#0F6E8C" }} />Previsão</li>
          <li><i className="tr faixa" />Faixa provável</li>
          {normal && <li><i className="tr faixa" style={{ background: "#DDE6EA" }} />Faixa habitual do mês</li>}
        </ul>
        <p className="apoio">
          A faixa habitual mostra onde o nível costuma ficar em cada mês (metade central dos anos, de 2000 até hoje). A
          faixa provável é o intervalo de 80% da previsão.
        </p>
      </section>

      <section className="cartao" aria-labelledby="p-prox">
        <h2 id="p-prox" className="rotulo-h">Previsão mês a mês</h2>
        <PrevisaoMeses previsao={previsao} cobertura={aval.cobertura_intervalo} />
        {baixaConfianca.length > 0 && (
          <p className="apoio">
            Previsões de {baixaConfianca.join(" e ")} meses à frente têm baixa confiança: nos testes, servem como indicação
            de tendência.
          </p>
        )}
      </section>

      </div>
      <div className="col">
      <section className="cartao" aria-labelledby="p-band">
        <div className="linha-flex">
          <div>
            <h2 id="p-band" className="rotulo-h">Bandeira tarifária vigente ({mesLongo(bandeira.vigente.mes)})</h2>
            <p className="apoio">Informação oficial da ANEEL.</p>
          </div>
          <BandeiraPill bandeira={bandeira.vigente.bandeira} grande />
        </div>
        {bandeira.linha_do_tempo && (
          <>
            <h3 className="sub">Últimos 24 meses</h3>
            <LinhaDoTempo linha={bandeira.linha_do_tempo} />
          </>
        )}
        <p className="apoio">Estimativa estatística de mudança não substitui a decisão oficial da ANEEL.</p>
      </section>

      {bandeira.valores && (
        <section className="cartao" aria-labelledby="p-calc">
          <h2 id="p-calc" className="rotulo-h">Quanto a bandeira adiciona na minha conta?</h2>
          <Calculadora valores={bandeira.valores} vigente={bandeira.vigente} />
        </section>
      )}

      <section className="cartao destaque" aria-labelledby="p-ent">
        <h2 id="p-ent">O que isso significa para a minha conta?</h2>
        <p>
          Quando os reservatórios ficam baixos para a época do ano, o sistema precisa acionar usinas mais caras, e isso
          pode levar a uma bandeira tarifária mais alta. Mas a bandeira também depende de outros fatores, como a
          demanda e a geração eólica e solar, e o nível dos reservatórios sozinho não determina a bandeira.
        </p>
        <p className="como-ler">
          <strong>Como ler o risco:</strong> <span style={{ color: RISCO.Alto.fg }}>alto</span> quer dizer que o nível
          está entre os 20% mais baixos do histórico daquele mês; <span style={{ color: RISCO["Atenção"].fg }}>atenção</span>,
          entre os 40% mais baixos; e <span style={{ color: RISCO.Baixo.fg }}>baixo</span>, acima disso.
        </p>
      </section>

      <section className="cartao" aria-labelledby="p-faq">
        <h2 id="p-faq" className="rotulo-h">Perguntas frequentes</h2>
        <Faq painel={painel} />
      </section>

      </div>
      </div>

      <footer className="rodape miolo">
        <a href="#/tecnico">Ver detalhes técnicos</a>
        <span>Fontes: ONS e ANEEL, dados abertos.</span>
      </footer>
    </main>
  );
}
