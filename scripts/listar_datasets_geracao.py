"""Lista, no bucket público do ONS, os datasets cujo nome sugere geração ou balanço de energia."""
import boto3
from botocore import UNSIGNED
from botocore.config import Config

BUCKET = "ons-aws-prod-opendata"
PALAVRAS = ("balanco", "geracao", "eolic", "solar", "fotovolt", "carga")

s3 = boto3.client("s3", config=Config(signature_version=UNSIGNED))
paginas = s3.get_paginator("list_objects_v2").paginate(Bucket=BUCKET, Prefix="dataset/", Delimiter="/")
datasets = [p["Prefix"] for pg in paginas for p in pg.get("CommonPrefixes", [])]
for d in datasets:
    if any(k in d.lower() for k in PALAVRAS):
        print(d)
print(f"\n{len(datasets)} datasets no total")