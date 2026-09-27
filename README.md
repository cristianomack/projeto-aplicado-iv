# Do Reservatório à Conta de Luz: Previsão de Risco Energético-Hídrico e Bandeiras Tarifárias no Brasil

Projeto desenvolvido para a disciplina **Projeto Aplicado IV** — Ciência de Dados EaD, Universidade Presbiteriana Mackenzie (2026/02).

## Equipe

- Cristiano Prado do Carmo, 10720249
- Bruna Mendes Rocha, 10441296


## Sobre o projeto

O Brasil possui uma matriz elétrica predominantemente hidrelétrica, o que cria uma relação direta entre a disponibilidade de água nos reservatórios e a segurança do fornecimento de energia. Ao mesmo tempo, o crescimento acelerado da geração solar e eólica tem introduzido novos desafios operacionais ao sistema, como o fenômeno do *curtailment* (corte de geração por excesso de oferta).

Este projeto propõe um modelo de previsão de séries temporais para estimar o nível futuro de Energia Armazenada (EAR) nos reservatórios do Sistema Interligado Nacional (SIN), utilizando a Energia Natural Afluente (ENA) e a geração solar/eólica como variáveis explicativas. A partir dessa previsão, são derivadas camadas de classificação de risco energético-hídrico e uma estimativa de bandeira tarifária, com o objetivo de gerar tanto informação técnica quanto informação acessível à população.

## Objetivos de Desenvolvimento Sustentável (ODS)

- **ODS 11** — Cidades e Comunidades Sustentáveis (principal)
- **ODS 8** — Trabalho Decente e Crescimento Econômico (secundária)

## Fontes de dados

- **ONS — Portal de Dados Abertos** (dados.ons.org.br): Energia Armazenada (EAR), Energia Natural Afluente (ENA), geração por fonte. Coletados de forma automatizada via bucket público na AWS (`ons-aws-prod-opendata`).
- **ANEEL — Portal de Dados Abertos**: histórico de acionamento de bandeiras tarifárias.

## Estrutura do repositório

```
.
├── README.md
├── requirements.txt
├── notebooks/
│   └── cd_projeto_aplicado_IV_doc.ipynb   # Notebook principal do projeto
├── scripts/
│   ├── explorar_bucket_ons.py             # Descoberta dos datasets no bucket do ONS
│   ├── baixar_dados_ons.py                # Download automatizado de EAR e ENA
│   └── listar_arquivos_ear_ena.py         # Listagem dos arquivos disponíveis
├── data/
│   └── raw/
│       ├── ear_subsistema/                # EAR diário por subsistema (2000-2026)
│       └── ena_subsistema/                # ENA diário por subsistema (2000-2026)
└── docs/
    └── img/                                # Figuras e diagramas usados no notebook
```

## Como executar

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
4. (Opcional) Para atualizar os dados brutos, execute os scripts de coleta:
```bash
   python scripts/baixar_dados_ons.py
```
5. Abra `notebooks/cd_projeto_aplicado_IV_doc.ipynb` no Jupyter ou VS Code, selecione o kernel do `venv` e execute as células.

## Cronograma de entregas
> Cronograma detalhado, semana a semana, disponível na seção "Cronograma" do notebook principal.

| Entrega | Data | Conteúdo |
|---|---|---|
| Entrega 1 | 31/08 | Definição do tema, equipe, base de dados, documentação inicial |
| Entrega 2 | 28/09 | Referencial teórico, pipeline da solução, cronograma |
| Entrega 3 | 26/10 | EDA, pré-processamento, modelo base |
| Entrega 4 | 30/11 | Implementação final, apresentação, documentação completa |

## Licença

A definir.