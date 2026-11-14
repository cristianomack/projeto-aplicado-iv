# Do Reservatório à Conta de Luz: Previsão de Risco Energético-Hídrico e Bandeiras Tarifárias no Brasil

Projeto desenvolvido para a disciplina **Projeto Aplicado IV**, Ciência de Dados EaD, Universidade Presbiteriana Mackenzie (2026/02).

**Painel público:** https://cristianomack.github.io/projeto-aplicado-iv/
(página técnica em `#/tecnico` e metodologia em `#/sobre`)

## Equipe

- Cristiano Prado do Carmo, 10720249
- Bruna Mendes Rocha, 10441296

## Sobre o projeto

O Brasil possui uma matriz elétrica predominantemente hidrelétrica, o que cria uma relação direta entre a disponibilidade de água nos reservatórios e a segurança do fornecimento de energia. Ao mesmo tempo, o crescimento acelerado da geração solar e eólica tem introduzido novos desafios operacionais ao sistema, como o fenômeno do *curtailment* (corte de geração por excesso de oferta).

Este projeto prevê, de 1 a 6 meses à frente, a Energia Armazenada (EAR) nos reservatórios do subsistema Sudeste/Centro-Oeste, usando a Energia Natural Afluente (ENA) como variável explicativa. A previsão alimenta uma **camada de decisão** que traduz o nível previsto em risco hídrico (alto, atenção ou baixo) em relação ao histórico do mesmo mês do ano, com indicação de incerteza e de confiança. O resultado é publicado em um **painel web** com uma visão pública, em linguagem simples, e uma visão técnica, com backtest e limitações.

A bandeira tarifária vigente vem da ANEEL. O projeto também avalia, de forma honesta, se é possível antecipar mudanças de bandeira.

## Principais resultados

Avaliação em janela expansiva (walk-forward) no período de teste, de 01/2022 a 10/2026 (58 meses). Treino até 2018 e validação de 2019 a 2021.

- **O melhor modelo depende do horizonte.** O Gradient Boosting (previsão direta, um modelo por horizonte) vence em 1 mês e de 4 a 6 meses. O SARIMA sazonal empata em 2 e 3 meses. O SARIMA(2,1,1) piora muito nos horizontes longos.
- **O erro cresce com o horizonte**, como esperado. A tabela de RMSE por horizonte, comparada a duas referências simples (persistência e persistência com variação sazonal), está no notebook.
- **A faixa de 80% perde cobertura nos horizontes longos** (cerca de 55% e 52% em 5 e 6 meses). Por isso o painel marca essas previsões como de baixa confiança.
- **Cenários de ENA climatológica não são uma banda calibrada** (cobertura de 25% a 36%), e por isso não são apresentados como intervalo.
- **Mudanças de bandeira são difíceis de antecipar.** Repetir a bandeira do mês anterior é uma referência forte. O alerta estatístico acertou 3 de 12 mudanças, com 6 alarmes falsos em 46 meses sem mudança, e a diferença de F1 em relação à persistência é inconclusiva (IC 95%: de -0,261 a 0,065).
- **Mudança de regime desde 2022.** Com mais geração eólica e solar e menos térmica, o nível da EAR deixou de separar bem as bandeiras. Por isso a bandeira não é derivada da EAR. A revisão da capacidade máxima pelo ONS em 2026 é outra fonte de deriva.

## Objetivos de Desenvolvimento Sustentável (ODS)

- **ODS 11**: Cidades e Comunidades Sustentáveis (principal)
- **ODS 7**: Energia Limpa e Acessível (complementar), em especial a meta 7.1, de acesso a serviços de energia confiáveis e a preços acessíveis

O painel é público e gratuito, e o código, os dados e o notebook são abertos e reutilizáveis.

## Fontes de dados

Todas as fontes são primárias e abertas.

- **ONS, Portal de Dados Abertos** (dados.ons.org.br): EAR e ENA por subsistema, em base diária de 2000 a 2026, coletadas de forma automatizada pelo bucket público na AWS (`ons-aws-prod-opendata`). A série é agregada ao passo mensal na modelagem.
- **ONS, balanço de energia por subsistema** (base horária): geração por fonte (térmica, eólica, solar e hidráulica), agregada ao mês e usada como variável na classificação da bandeira (fração térmica e fração eólica e solar).
- **ANEEL, Portal de Dados Abertos**: histórico de acionamento das bandeiras tarifárias (Verde, Amarela, Vermelha com patamares 1 e 2, e Escassez Hídrica) e seus valores, no conjunto de dados de bandeira tarifária de acionamento (`resource_id` `0591b8f6-fe54-437b-b72b-1aa2efd46e42`). A data da última consulta fica registrada no campo `fonte_aneel_gerado_em` do arquivo `data/processed/painel_hidrico.json`.

## Estrutura do repositório

```
.
├── README.md
├── LICENSE
├── requirements.txt
├── notebooks/
│   └── cd_projeto_aplicado_IV_doc.ipynb   # Notebook principal (executável do início ao fim)
├── scripts/
│   ├── explorar_bucket_ons.py             # Descoberta dos datasets no bucket do ONS
│   ├── listar_arquivos_ear_ena.py         # Listagem dos arquivos de EAR e ENA
│   ├── baixar_dados_ons.py                # Download automatizado de EAR e ENA
│   ├── listar_datasets_geracao.py         # Descoberta dos datasets de geração
│   ├── explorar_balanco_ons.py            # Exploração do balanço de energia
│   └── baixar_balanco_ons.py              # Download do balanço de energia por subsistema
├── data/
│   ├── raw/
│   │   ├── ear_subsistema/                # EAR diário (ONS)
│   │   ├── ena_subsistema/                # ENA diária (ONS)
│   │   ├── balanco_energia_subsistema/    # Balanço de energia horário (ONS)
│   │   └── aneel_bandeiras/               # Acionamento das bandeiras (ANEEL)
│   └── processed/                         # Gerados pelo notebook
│       ├── se_diario.csv
│       ├── se_mensal.csv
│       ├── resultados_modelo_base.csv
│       └── painel_hidrico.json            # Contrato de dados consumido pelo painel
├── docs/
│   ├── dm-bandeira-tarifaria-acionamento.pdf   # Dicionário de dados da ANEEL
│   └── img/                               # Figuras e diagramas
├── web/                                   # Painel (React + Vite), publicado no GitHub Pages
└── .github/workflows/pages.yml            # Build e deploy automáticos do painel
```

## Como reproduzir

### 1. Notebook (modelos, avaliação e geração do JSON do painel)

1. Clone o repositório e crie um ambiente virtual Python:
```bash
python -m venv venv
```
2. Ative o ambiente:
   - Windows (PowerShell): `venv\Scripts\Activate.ps1`
   - Mac/Linux: `source venv/bin/activate`
3. Instale as dependências:
```bash
pip install -r requirements.txt
```
4. (Opcional) Para atualizar os dados brutos do ONS:
```bash
python scripts/baixar_dados_ons.py
python scripts/baixar_balanco_ons.py
```
   Os dados brutos já acompanham o repositório, então o download só é necessário para atualizá-los.
5. Abra `notebooks/cd_projeto_aplicado_IV_doc.ipynb` no Jupyter ou no VS Code, selecione o kernel do `venv` e use **Restart e Run All**. O notebook deve ser executado a partir da pasta `notebooks/`, pois usa caminhos relativos (`../data` e `../docs/img`). Ele gera as figuras em `docs/img` e os dados tratados em `data/processed`, incluindo `painel_hidrico.json`.

### 2. Painel web

Requer Node 20 ou superior (testado com Node 22).

```bash
cd web
npm install
npm run dev      # servidor local
npm run build    # gera web/dist
```

O painel lê `data/processed/painel_hidrico.json`, copiado para `web/public/dados/` automaticamente antes do `dev` e do `build`. A cada push na branch `main` que altere `web/`, o JSON ou o workflow, o GitHub Actions compila e publica o painel no GitHub Pages.

## Cronograma de entregas

> O cronograma detalhado, semana a semana e vinculado aos objetivos específicos, está na seção "Cronograma" do notebook principal.

| Entrega | Checkpoint | Data | Conteúdo | Situação |
|---|---|---|---|---|
| Entrega 1 | 17/08 | 31/08 | Definição do tema, equipe, base de dados, documentação inicial | Concluída |
| Entrega 2 | 14/09 | 28/09 | Referencial teórico, pipeline da solução, cronograma | Concluída |
| Entrega 3 | 05/10 | 26/10 | EDA, pré-processamento, modelo base | Concluída |
| Entrega 4 | 02/11 | 30/11 | Implementação final, painel, apresentação, documentação completa | Em fechamento |

## Limitações e trabalhos futuros

- O risco usa um critério convencional (percentis 20 e 40 do mês), não calibrado em custo ou impacto.
- A previsão cobre o subsistema Sudeste/Centro-Oeste. A extensão para Sul, Nordeste e Norte reaproveita o mesmo pipeline.
- A atualização dos dados é manual. Um workflow mensal automático de coleta, reprocessamento e publicação é o próximo passo natural.
- Levar a geração solar, eólica e térmica (hoje usada só na classificação da bandeira) e a carga à previsão da EAR pode ajudar a captar a mudança de regime observada desde 2022.

## Licença

O código é distribuído sob a licença MIT (arquivo `LICENSE`). Os dados pertencem às fontes originais (ONS e ANEEL), que os disponibilizam como dados abertos.
