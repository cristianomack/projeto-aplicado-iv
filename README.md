# Do Reservatório à Conta de Luz: Previsão de Risco Energético-Hídrico e Bandeiras Tarifárias no Brasil

Projeto desenvolvido para a disciplina **Projeto Aplicado IV** — Ciência de Dados EaD, Universidade Presbiteriana Mackenzie (2026/02).

## Equipe

- Cristiano Prado do Carmo, 10720249
- Bruna Mendes Rocha, matrícula


## Sobre o projeto

O Brasil possui uma matriz elétrica predominantemente hidrelétrica, o que cria uma relação direta entre a disponibilidade de água nos reservatórios e a segurança do fornecimento de energia. Ao mesmo tempo, o crescimento acelerado da geração solar e eólica tem introduzido novos desafios operacionais ao sistema, como o fenômeno do *curtailment* (corte de geração por excesso de oferta).

Este projeto propõe um modelo de previsão de séries temporais para estimar o nível futuro de Energia Armazenada (EAR) nos reservatórios do Sistema Interligado Nacional (SIN), utilizando a Energia Natural Afluente (ENA) e a geração solar/eólica como variáveis explicativas. A partir dessa previsão, são derivadas camadas de classificação de risco energético-hídrico e uma estimativa de bandeira tarifária, com o objetivo de gerar tanto informação técnica quanto informação acessível à população.

## Objetivos de Desenvolvimento Sustentável (ODS)

- **ODS 11** — Cidades e Comunidades Sustentáveis (principal)
- **ODS 8** — Trabalho Decente e Crescimento Econômico (secundária)

## Fontes de dados

- **ONS — Portal de Dados Abertos** (dados.ons.org.br): Energia Armazenada (EAR), Energia Natural Afluente (ENA), geração por fonte.
- **ANEEL — Portal de Dados Abertos**: histórico de acionamento de bandeiras tarifárias.

## Estrutura do repositório

```
.
├── README.md
├── notebooks/          # Notebook principal do projeto (cd_projeto_aplicado_IV_doc.ipynb)
├── data/               # Dados brutos e processados
└── docs/               # Documentação complementar, referências, apresentações
```

> Estrutura de pastas provisória — ajustar conforme a organização real do grupo.

## Como executar

Instruções detalhadas de ambiente e execução serão adicionadas conforme o projeto avança (ver seção de EDA/Modelos no notebook principal).

## Cronograma de entregas

| Entrega | Data | Conteúdo |
|---|---|---|
| Entrega 1 | 31/08 | Definição do tema, equipe, base de dados, documentação inicial |
| Entrega 2 | 28/09 | Referencial teórico, pipeline da solução, cronograma |
| Entrega 3 | 26/10 | EDA, pré-processamento, modelo base |
| Entrega 4 | 30/11 | Implementação final, apresentação, documentação completa |

## Licença

A definir.