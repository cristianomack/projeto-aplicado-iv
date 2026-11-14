import { useEffect, useState } from "react";
import Publico from "./pages/Publico";
import Sobre from "./pages/Sobre";
import Tecnico from "./pages/Tecnico";

const ROTAS = { "#/tecnico": "tecnico", "#/sobre": "sobre" };
const rotaAtual = () => ROTAS[window.location.hash] ?? "publico";

export default function App() {
  const [rota, setRota] = useState(rotaAtual());
  const [painel, setPainel] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const aoMudar = () => {
      setRota(rotaAtual());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", aoMudar);
    return () => window.removeEventListener("hashchange", aoMudar);
  }, []);

  useEffect(() => {
    fetch("./dados/painel_hidrico.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setPainel)
      .catch((e) => setErro(e.message));
  }, []);

  return (
    <div className={rota === "tecnico" ? "app app-tecnico" : "app app-publico"}>
      <nav className="nav" aria-label="Navegação principal">
        <a href="#/" aria-current={rota === "publico" ? "page" : undefined}>Painel público</a>
        <a href="#/tecnico" aria-current={rota === "tecnico" ? "page" : undefined}>Detalhes técnicos</a>
        <a href="#/sobre" aria-current={rota === "sobre" ? "page" : undefined}>Sobre</a>
      </nav>
      {erro && <p className="aviso" role="alert">Não foi possível carregar os dados ({erro}).</p>}
      {!painel && !erro && <p className="carregando">Carregando…</p>}
      {painel && rota === "tecnico" && <Tecnico painel={painel} />}
      {painel && rota === "sobre" && <Sobre painel={painel} />}
      {painel && rota === "publico" && <Publico painel={painel} />}
    </div>
  );
}
