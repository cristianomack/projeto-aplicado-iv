import EarChart from "../components/EarChart";
import { BandeiraPill, RiscoChip, Semaforo } from "../components/ui";
import { mesLongo, pct, soMes } from "../format";

const FRASE = {
  Baixo: "Tranquila",
  "Atenção": "Atenção",
  Alto: "Risco alto",
};

export default function Publico({ painel }) {
  const { situacao, previsao, historico, bandeira } = painel;
  const baixaConfianca = previsao.filter((p) => p.confianca === "baixa").map((p) => p.horizonte);
  const abaixoDe = Math.round(situacao.percentil_do_mes);

  return (
    <main className="pagina-publico">
      <header className="topo">
        <p className="sobretitulo">Do reservatório à conta de luz</p>
        <h1>Como estão os reservatórios da sua região</h1>
        <p className="regiao">{painel.regiao}</p>
      </header>

      <section className="cartao" aria-labelledby="p-sit">
        <div className="situacao">
          <Semaforo risco={situacao.risco} />
          <div>
            <p className="rotulo">Situação hoje</p>
            <h2 id="p-sit">{FRASE[situacao.risco]}</h2>
            <p>Os reservatórios estão com {pct(situacao.ear, 0)} da capacidade ({mesLongo(situacao.mes)}).</p>
          </div>
        </div>
        <p className="apoio">
          Nesta época do ano, o nível já foi mais baixo em {abaixoDe}% dos anos desde 2000.
        </p>
        <EarChart historico={historico} previsao={previsao} compacto />
        <p className="legenda">Últimos 24 meses e previsão para os próximos 6.</p>
      </section>

      <section className="cartao linha-flex" aria-labelledby="p-band">
        <div>
          <h2 id="p-band" className="rotulo-h">Bandeira tarifária vigente ({mesLongo(bandeira.vigente.mes)})</h2>
          <p className="apoio">Informação oficial da ANEEL. Estimativa estatística de mudança não substitui a decisão oficial.</p>
        </div>
        <BandeiraPill bandeira={bandeira.vigente.bandeira} grande />
      </section>

      <section className="cartao" aria-labelledby="p-prox">
        <h2 id="p-prox" className="rotulo-h">Risco nos próximos meses</h2>
        <ul className="meses">
          {previsao.map((p) => (
            <li key={p.mes}>
              <span className="mes">{soMes(p.mes)}</span>
              <RiscoChip risco={p.risco} curto />
              {p.incerto && <span className="incerto">incerto</span>}
            </li>
          ))}
        </ul>
        {baixaConfianca.length > 0 && (
          <p className="apoio">
            Previsões de {baixaConfianca.join(" e ")} meses à frente têm baixa confiança: serviram nos testes apenas
            como indicação de tendência.
          </p>
        )}
      </section>

      <section className="cartao destaque" aria-labelledby="p-ent">
        <h2 id="p-ent">O que isso significa para a minha conta?</h2>
        <p>
          Quando os reservatórios ficam baixos para a época do ano, o sistema precisa acionar usinas mais caras, e isso
          pode levar a uma bandeira tarifária mais alta. Mas a bandeira também depende de outros fatores, como a
          demanda e a geração eólica e solar, e o nível dos reservatórios sozinho não determina a bandeira.
        </p>
      </section>

      <footer className="rodape">
        <a href="#/tecnico">Ver detalhes técnicos</a>
        <span>Fontes: ONS e ANEEL, dados abertos.</span>
      </footer>
    </main>
  );
}
