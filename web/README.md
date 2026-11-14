# Painel energético-hídrico (SPA)

Aplicação estática (React + Vite, gráficos em SVG puro, sem backend) que exibe o JSON gerado pelo notebook:
`data/processed/painel_hidrico.json`.

- `#/` painel público (celular): situação hoje, bandeira vigente, risco dos próximos meses.
- `#/tecnico` detalhes técnicos: previsão com intervalo de 80%, confiança por horizonte, alerta de bandeira e limitações.

## Rodar localmente

```bash
cd web
npm install
npm run dev        # copia o JSON de data/processed e abre em http://localhost:5173
npm run build      # gera web/dist
```

## Atualizar os dados

1. Atualize os dados do ONS e da ANEEL e rode o notebook até a seção "Camada de decisão".
2. Faça commit de `data/processed/painel_hidrico.json` e envie para `main`.
3. O workflow `.github/workflows/pages.yml` recompila e publica no GitHub Pages.

Para ativar a publicação: no GitHub, Settings > Pages > Source: **GitHub Actions**.
