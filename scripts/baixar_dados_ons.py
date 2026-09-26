import boto3
from pathlib import Path
from botocore import UNSIGNED
from botocore.config import Config

s3 = boto3.client("s3", region_name="sa-east-1", config=Config(signature_version=UNSIGNED))
bucket = "ons-aws-prod-opendata"

pastas = {
    "dataset/ear_subsistema_di/": "data/raw/ear_subsistema",
    "dataset/ena_subsistema_di/": "data/raw/ena_subsistema",
}

falhas = []

for prefixo, destino in pastas.items():
    Path(destino).mkdir(parents=True, exist_ok=True)
    resp = s3.list_objects_v2(Bucket=bucket, Prefix=prefixo)
    arquivos_csv = [obj["Key"] for obj in resp.get("Contents", []) if obj["Key"].endswith(".csv")]

    print(f"\nBaixando {len(arquivos_csv)} arquivos CSV de {prefixo}...")
    for key in arquivos_csv:
        nome_arquivo = key.split("/")[-1]
        caminho_local = Path(destino) / nome_arquivo
        try:
            s3.download_file(bucket, key, str(caminho_local))
            print(f"  OK: {nome_arquivo}")
        except Exception as e:
            print(f"  FALHOU: {nome_arquivo} -> {e}")
            falhas.append(key)

print(f"\nDownload concluído. {len(falhas)} arquivo(s) falharam:")
for f in falhas:
    print(f"  {f}")