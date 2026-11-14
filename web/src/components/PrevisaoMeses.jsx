import { mesLongo, num, pct } from "../format";
import { RiscoChip } from "./ui";

const FRASE_RISCO = {
  Baixo: "Nível normal ou acima do normal para a época.",
  "Atenção": "Nível abaixo do normal para a época. Vale acompanhar.",
  Alto: "Nível bem abaixo do normal para a época.",
};

export default function PrevisaoMeses({ previsao, cobertura }) {
  return (
    <div className="acordeao">
      {previsao.map((p) => (
        <details key={p.mes}>
          <summary>
            <span className="mes-resumo">{mesLongo(p.mes)}</span>
            <span className="num-resumo">{pct(p.ear, 0)}</span>
            <RiscoChip risco={p.risco} curto />
            {p.incerto && <span className="incerto">incerto</span>}
          </summary>
          <div className="detalhe">
            <p>{FRASE_RISCO[p.risco]}</p>
            {p.incerto && (
              <p>
                O intervalo de previsão chega à faixa de risco “{p.risco_inf === "Atenção" ? "atenção" : p.risco_inf.toLowerCase()}”,
                então esse mês pode ficar pior do que o valor central indica.
              </p>
            )}
            <p>Nível esperado: {num(p.ear)}% (intervalo de 80%: {num(p.inf)}% a {num(p.sup)}%).</p>
            <p>
              Confiança: <strong>{p.confianca}</strong>. Nos testes, esse intervalo cobriu o valor real em{" "}
              {Math.round(cobertura[p.horizonte] * 100)}% dos casos.
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
