export const RISCO = {
  Baixo: { rotulo: "Risco baixo", curto: "Baixo", bg: "#DDF3E4", fg: "#14532D", traco: "#1E7B4B" },
  "Atenção": { rotulo: "Atenção", curto: "Atenção", bg: "#FDF0C0", fg: "#5B4100", traco: "#B3761E" },
  Alto: { rotulo: "Risco alto", curto: "Alto", bg: "#FBDAD6", fg: "#7A1410", traco: "#B3261E" },
};

export const BANDEIRA = {
  Verde: { bg: "#1E7B4B", fg: "#FFFFFF" },
  Amarela: { bg: "#F6C945", fg: "#10222E" },
  Vermelha: { bg: "#B3261E", fg: "#FFFFFF" },
};

export function RiscoChip({ risco, curto = false }) {
  const r = RISCO[risco];
  return (
    <span className="chip" style={{ background: r.bg, color: r.fg }}>
      {curto ? r.curto : r.rotulo}
    </span>
  );
}

export function BandeiraPill({ bandeira, grande = false }) {
  const b = BANDEIRA[bandeira] ?? { bg: "#D2DEE3", fg: "#10222E" };
  return (
    <span className={grande ? "pill pill-grande" : "pill"} style={{ background: b.bg, color: b.fg }}>
      {bandeira}
    </span>
  );
}

export function Semaforo({ risco }) {
  const ativo = { Baixo: 0, "Atenção": 1, Alto: 2 }[risco];
  const cores = ["#1E7B4B", "#F6C945", "#B3261E"];
  return (
    <div className="semaforo" aria-hidden="true">
      {cores.map((c, i) => (
        <span key={c} style={{ background: c, opacity: i === ativo ? 1 : 0.25 }} />
      ))}
    </div>
  );
}
