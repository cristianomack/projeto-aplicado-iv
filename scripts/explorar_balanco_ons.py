"""Inspeciona datasets do ONS candidatos a variáveis explicativas: arquivos, tamanho e colunas."""
import boto3
from botocore import UNSIGNED
from botocore.config import Config

BUCKET = "ons-aws-prod-opendata"
DATASETS = [
    "balanco_energia_subsistema_ho",
    "restricao_coff_eolica_tm",
    "restricao_coff_fotovoltaica_tm",
]

s3 = boto3.client("s3", config=Config(signature_version=UNSIGNED))

for nome in DATASETS:
    arquivos = []
    for pg in s3.get_paginator("list_objects_v2").paginate(Bucket=BUCKET, Prefix=f"dataset/{nome}/"):
        arquivos += [(o["Key"], o["Size"]) for o in pg.get("Contents", [])]
    arquivos.sort()
    print(f"\n===== {nome} =====")
    print(f"{len(arquivos)} arquivos, {sum(t for _, t in arquivos) / 1e6:.1f} MB no total")
    for chave, tamanho in arquivos[:2] + arquivos[-2:]:
        print(f"  {chave.split('/')[-1]}  ({tamanho / 1e6:.1f} MB)")
    csvs = [k for k, _ in arquivos if k.lower().endswith(".csv")]
    if csvs:
        trecho = s3.get_object(Bucket=BUCKET, Key=csvs[-1], Range="bytes=0-1500")["Body"].read()
        linhas = trecho.decode("utf-8", errors="replace").splitlines()[:4]
        print("  Colunas e primeiras linhas de", csvs[-1].split("/")[-1])
        for l in linhas:
            print("   ", l)