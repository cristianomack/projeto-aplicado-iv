import Downloads from "../components/Downloads";
import { CURSO, EQUIPE, NOTEBOOK_URL, ODS, REPO_URL, VIDEO_URL } from "../config";
import { dataBr } from "../download";
import { mesLongo, pct } from "../format";

export default function Sobre({ painel }) {
  const r = painel.bandeira.resumo_alerta;
  const cob = painel.avaliacao_teste.cobertura_intervalo;
  const serie = painel.serie_ear ?? painel.historico;
  const primeiro = serie[0].mes;

  return (
    <main className="pagina-sobre">
      <header className="topo-sobre">
        <p className="sobretitulo">Sobre o projeto</p>
        <h1>Do reservatório à conta de luz</h1>
        <p className="sobre-texto">
          Previsão de risco energético-hídrico e bandeiras tarifárias no Brasil. {CURSO}. Equipe: {EQUIPE.join(" e ")}.
        </p>
      </header>

      <div className="miolo-sobre">
        <section className="cartao" aria-labelledby="s-ods">
          <h2 id="s-ods" className="rotulo-h">Objetivo de Desenvolvimento Sustentável</h2>
          <div className="ods">
            <span className="ods-selo" aria-hidden="true">{ODS.numero}</span>
            <div>
              <h3>ODS {ODS.numero}: {ODS.titulo}</h3>
              <p>{ODS.texto}</p>
            </div>
          </div>
          <p className="apoio">
            O painel é público, gratuito e aberto: o código, os dados e o notebook estão no repositório e podem ser
            reutilizados.
          </p>
        </section>

        <section className="cartao" aria-labelledby="s-que">
          <h2 id="s-que" className="rotulo-h">O que o painel faz</h2>
          <p>
            Acompanha a energia armazenada nos reservatórios ({painel.regiao}) e estima como ela deve evoluir nos próximos 6
            meses. O risco é a posição do nível frente ao histórico do mesmo mês do ano desde {primeiro.slice(0, 4)}:
            alto, abaixo do percentil 20; atenção, abaixo do 40; baixo, acima disso. Quando a faixa provável de 80% cruza
            o limite entre duas categorias, a previsão é marcada como incerta.
          </p>
          <p>
            A bandeira tarifária vigente vem da ANEEL. O painel mostra também um alerta estatístico de mudança de
            bandeira, que é uma estimativa e não substitui a decisão oficial.
          </p>
        </section>

        <section className="cartao" aria-labelledby="s-fontes">
          <h2 id="s-fontes" className="rotulo-h">De onde vêm os dados</h2>
          <ul className="lista-simples">
            <li>
              <strong>ONS, dados abertos:</strong> energia armazenada (EAR) e energia natural afluente (ENA) por
              subsistema. Último mês completo usado: {mesLongo(painel.origem)}.
            </li>
            <li>
              <strong>ANEEL, dados abertos:</strong> histórico de bandeiras tarifárias e seus valores.
              {painel.fonte_aneel_gerado_em && <> Consultadas em {dataBr(painel.fonte_aneel_gerado_em)}.</>}
            </li>
          </ul>
          <p className="apoio">
            São fontes primárias, sem bases intermediárias. Os scripts de download estão no repositório.
          </p>
        </section>

        <section className="cartao" aria-labelledby="s-met">
          <h2 id="s-met" className="rotulo-h">Como a previsão é feita</h2>
          <ul className="lista-simples">
            <li>
              Um modelo de Gradient Boosting para cada horizonte de 1 a 6 meses (previsão direta), comparado com SARIMA e
              com duas referências simples (persistência e persistência com variação sazonal).
            </li>
            <li>
              Divisão no tempo: treino até 2018, validação de 2019 a 2021 e teste a partir de 2022, com avaliação em
              janela expansiva (walk-forward).
            </li>
            <li>
              A faixa provável de 80% vem dos erros do período de validação, e sua cobertura real é medida no teste.
            </li>
            <li>
              A bandeira de cada mês é definida no fim do mês anterior, então as variáveis do modelo usam defasagem de um
              mês.
            </li>
          </ul>
        </section>

        <section className="cartao" aria-labelledby="s-lim">
          <h2 id="s-lim" className="rotulo-h">O que o painel não promete</h2>
          <ul className="lista-simples">
            <li>
              A precisão cai com o horizonte. No teste, a faixa de 80% cobriu {pct(cob["1"] * 100, 0)} dos casos a 1 mês e{" "}
              {pct(cob["6"] * 100, 0)} a 6 meses, por isso as previsões mais distantes servem como tendência.
            </li>
            <li>
              Repetir a bandeira do mês anterior é uma referência difícil de bater. O alerta do painel antecipou{" "}
              {r.mudancas_acertadas} de {r.mudancas_total} mudanças no teste, com {r.alarmes_falsos} alarmes falsos em{" "}
              {r.meses_sem_mudanca} meses sem mudança.
            </li>
            <li>
              Desde 2022 o nível dos reservatórios deixou de separar bem as bandeiras (mais energia eólica e solar,
              menos térmica), então a bandeira não é calculada a partir da EAR.
            </li>
          </ul>
          <p className="apoio">
            Detalhes e testes completos estão na <a href="#/tecnico">página técnica</a> e no notebook.
          </p>
        </section>

        <section className="cartao" aria-labelledby="s-rep">
          <h2 id="s-rep" className="rotulo-h">Código, notebook e vídeo</h2>
          <ul className="lista-simples">
            <li><a href={REPO_URL} target="_blank" rel="noreferrer">Repositório no GitHub</a>, com código, dados e instruções para reproduzir.</li>
            <li><a href={NOTEBOOK_URL} target="_blank" rel="noreferrer">Notebook completo</a>, executável do início ao fim.</li>
            {VIDEO_URL && <li><a href={VIDEO_URL} target="_blank" rel="noreferrer">Vídeo de apresentação</a>.</li>}
          </ul>
        </section>

        <section className="cartao" aria-labelledby="s-dados">
          <h2 id="s-dados" className="rotulo-h">Baixar os dados</h2>
          <Downloads painel={painel} />
        </section>
      </div>
    </main>
  );
}
