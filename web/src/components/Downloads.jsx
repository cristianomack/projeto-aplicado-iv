import { baixar, csvPrevisao, csvSerie } from "../download";

/** Botões para baixar os dados do painel (CSV pronto para o Excel em português, e o JSON completo). */
export default function Downloads({ painel }) {
  return (
    <div className="downloads">
      <div className="botoes-baixar">
        <button type="button" onClick={() => baixar("previsao_ear_6_meses.csv", csvPrevisao(painel))}>
          Previsão (CSV)
        </button>
        <button type="button" onClick={() => baixar("serie_ear_mensal.csv", csvSerie(painel))}>
          Série histórica da EAR (CSV)
        </button>
        <a className="botao-link" href="./dados/painel_hidrico.json" download="painel_hidrico.json">
          Dados completos (JSON)
        </a>
      </div>
      <p className="apoio">Os CSV usam ponto e vírgula e vírgula decimal, e abrem direto no Excel em português.</p>
    </div>
  );
}
