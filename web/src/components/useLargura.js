import { useEffect, useRef, useState } from "react";

/** Mede a largura do contêiner para o SVG ser desenhado em tamanho real (texto sempre legível). */
export default function useLargura(inicial = 380) {
  const ref = useRef(null);
  const [largura, setLargura] = useState(inicial);
  useEffect(() => {
    if (!ref.current) return undefined;
    const ro = new ResizeObserver(([e]) => setLargura(Math.round(e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, largura];
}

/** Dimensões e margens do gráfico conforme a largura disponível. */
export function dimensoes(largura) {
  const W = Math.max(300, largura);
  const estreito = W < 520;
  return {
    W,
    H: estreito ? 250 : Math.max(280, Math.min(400, Math.round(W * 0.4))),
    m: estreito ? { l: 34, r: 12, t: 18, b: 30 } : { l: 48, r: 20, t: 18, b: 36 },
    estreito,
  };
}
