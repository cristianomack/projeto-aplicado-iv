"""Baixa o Balanço de Energia nos Subsistemas (ONS, base horária) a partir de ANO_INICIAL.

Saída: data/raw/balanco_energia_subsistema/BALANCO_ENERGIA_SUBSISTEMA_<ano>.csv
Uso (na raiz do repositório): python scripts/baixar_balanco_ons.py
"""
import re
from pathlib import Path

import boto3
from botocore import UNSIGNED
from botocore.config import Config

BUCKET = "ons-aws-prod-opendata"
PREFIXO = "dataset/balanco_energia_subsistema_ho/"
ANO_INICIAL = 2014  # as bandeiras começam em 2015; 2014 garante a defasagem de um mês
DESTINO = Path("data/raw/balanco_energia_subsistema")
PADRAO = re.compile(r"BALANCO_ENERGIA_SUBSISTEMA_(\d{4})\.csv$", re.IGNORECASE)

s3 = boto3.client("s3", config=Config(signature_version=UNSIGNED))
DESTINO.mkdir(parents=True, exist_ok=True)

baixados = 0
for pagina in s3.get_paginator("list_objects_v2").paginate(Bucket=BUCKET, Prefix=PREFIXO):
    for obj in pagina.get("Contents", []):
        m = PADRAO.search(obj["Key"])
        if not m or int(m.group(1)) < ANO_INICIAL:
            continue
        alvo = DESTINO / Path(obj["Key"]).name
        s3.download_file(BUCKET, obj["Key"], str(alvo))
        baixados += 1
        print(f"{alvo.name}  ({obj['Size'] / 1e6:.1f} MB)")
print(f"\n{baixados} arquivos em {DESTINO}")