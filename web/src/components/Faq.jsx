import { pct } from "../format";
import { REPO_URL } from "../config";

export default function Faq({ painel }) {
  const cob = painel.avaliacao_teste.cobertura_intervalo;
  const hs = Object.keys(cob).map(Number).sort((a, b) => a - b);
  const primeiro = hs[0], ultimo = hs[hs.length - 1];

  const itens = [
    ["O que é a EAR?",
      "É a Energia Armazenada nos reservatórios das usinas hidrelétricas, em porcentagem da capacidade máxima. Quanto maior, mais água guardada para gerar energia nos meses secos."],
    ["O que é a bandeira tarifária?",
      "É o sistema da ANEEL que sinaliza o custo de gerar energia no mês. Na bandeira verde não há adicional; nas bandeiras amarela e vermelha (patamares 1 e 2) a conta recebe um valor extra por kWh consumido."],
    ["Por que a bandeira muda?",
      "Ela depende do custo de geração: nível dos reservatórios, chuvas, uso de usinas térmicas (mais caras), demanda e geração eólica e solar. Desde 2022, o nível dos reservatórios sozinho deixou de separar as bandeiras, e por isso este painel não calcula a bandeira a partir do nível. Ele mostra a bandeira oficial vigente e, no painel técnico, o alerta de mudança do modelo, que acerta só parte das mudanças."],
    ["Posso confiar na previsão?",
      `Com cuidado. Nos testes, o intervalo de previsão cobriu o valor real em ${pct(cob[primeiro] * 100, 0)} dos casos para ${primeiro} mês e em ${pct(cob[ultimo] * 100, 0)} para ${ultimo} meses à frente. Por isso, as previsões de 5 e 6 meses servem como tendência e não como número exato. A previsão é estatística e não antecipa eventos extraordinários, como uma seca fora do histórico.`],
    ["De onde vêm os dados?",
      `Os dados de reservatórios (EAR) e afluências são do Operador Nacional do Sistema Elétrico (ONS) e as bandeiras e seus valores são da ANEEL, ambos em dados abertos${painel.fonte_aneel_gerado_em ? ` (base da ANEEL gerada em ${painel.fonte_aneel_gerado_em.split("-").reverse().join("/")})` : ""}.`],
    ["O que este painel não faz?",
      "Não prevê o valor da sua fatura nem a bandeira oficial dos próximos meses, que é decisão da ANEEL. Cobre apenas a região Sudeste/Centro-Oeste. É um projeto acadêmico do Mackenzie (Projeto Aplicado IV)."],
  ];

  return (
    <div className="faq">
      {itens.map(([p, r]) => (
        <details key={p}>
          <summary>{p}</summary>
          <p>{r}</p>
        </details>
      ))}
      <p className="apoio">Código, dados e metodologia: <a href={REPO_URL}>repositório no GitHub</a>.</p>
    </div>
  );
}
