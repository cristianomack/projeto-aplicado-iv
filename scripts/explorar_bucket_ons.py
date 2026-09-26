import boto3
from botocore import UNSIGNED
from botocore.config import Config

s3 = boto3.client("s3", region_name="sa-east-1", config=Config(signature_version=UNSIGNED))
bucket = "ons-aws-prod-opendata"

# Lista as "pastas" de primeiro nível dentro de dataset/
resp = s3.list_objects_v2(Bucket=bucket, Prefix="dataset/", Delimiter="/")
pastas = [cp["Prefix"] for cp in resp.get("CommonPrefixes", [])]

print(f"Total de datasets encontrados: {len(pastas)}\n")

# Filtra só as pastas relevantes para o projeto (EAR e ENA)
relevantes = [p for p in pastas if "ear" in p.lower() or "ena" in p.lower()]
print("Pastas relevantes (EAR/ENA):")
for p in relevantes:
    print(f"  {p}")