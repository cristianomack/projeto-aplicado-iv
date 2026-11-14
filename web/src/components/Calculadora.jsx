import { useState } from "react";
import { mesLongo } from "../format";
import { BANDEIRA } from "./ui";

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Calculadora({ valores, vigente }) {
  const [kwh, setKwh] = useState(150);
  const consumo = Number.isFinite(kwh) && kwh > 0 ? kwh : 0;

  return (
    <>
      <div className="controle">
        <label className="controle-rotulo" htmlFor="kwh">Consumo mensal, em kWh</label>
        <input id="kwh" className="campo" type="number" inputMode="numeric" min="0" max="5000" step="10"
          value={Number.isFinite(kwh) ? kwh : ""} onChange={(e) => setKwh(e.target.value === "" ? NaN : Number(e.target.value))} />
        <span className="apoio">Você encontra o consumo na sua conta de luz.</span>
      </div>
      <ul className="valores" aria-live="polite">
        {valores.map((v) => {
          const atual = v.grupo === vigente.bandeira && (v.nome === vigente.nome_aneel);
          return (
            <li key={v.nome} className={atual ? "valor atual" : "valor"}>
              <span className="pill" style={{ background: BANDEIRA[v.grupo].bg, color: BANDEIRA[v.grupo].fg }}>{v.nome}</span>
              <span className="custo">{brl((consumo * v.valor_r_mwh) / 1000)}</span>
              <span className="apoio">R$ {(v.valor_r_mwh / 10).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} a cada 100 kWh
                {atual ? " · bandeira vigente" : ""}</span>
            </li>
          );
        })}
      </ul>
      <p className="apoio">
        Adicional da bandeira por mês, <strong>sem impostos</strong>, calculado com o último valor registrado pela ANEEL
        para cada bandeira ({valores.map((v) => `${v.nome}: ${mesLongo(v.ultimo_mes)}`).join("; ")}). Os valores mudam ao
        longo do tempo e a conta final inclui tributos. Isto é uma estimativa e não substitui a sua fatura.
      </p>
    </>
  );
}
