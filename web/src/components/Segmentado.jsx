/** Controle segmentado acessível (um botão ativo por vez). */
export default function Segmentado({ rotulo, opcoes, valor, onChange }) {
  return (
    <div className="controle">
      <span className="controle-rotulo" id={`seg-${rotulo}`}>{rotulo}</span>
      <div role="group" aria-labelledby={`seg-${rotulo}`} className="segmentado">
        {opcoes.map((o) => (
          <button key={o.valor} type="button" aria-pressed={o.valor === valor} onClick={() => onChange(o.valor)}>
            {o.texto}
          </button>
        ))}
      </div>
    </div>
  );
}
