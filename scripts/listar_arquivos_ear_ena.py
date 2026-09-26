import boto3
from botocore import UNSIGNED
from botocore.config import Config

s3 = boto3.client("s3", region_name="sa-east-1", config=Config(signature_version=UNSIGNED))
bucket = "ons-aws-prod-opendata"

pastas = ["dataset/ear_subsistema_di/", "dataset/ena_subsistema_di/"]

for pasta in pastas:
    print(f"\n=== Arquivos em {pasta} ===")
    resp = s3.list_objects_v2(Bucket=bucket, Prefix=pasta)
    arquivos = resp.get("Contents", [])
    print(f"Total: {len(arquivos)} arquivos\n")
    for obj in arquivos[:10]:  # mostra só os 10 primeiros como amostra
        tamanho_kb = obj["Size"] / 1024
        print(f"  {obj['Key']}  ({tamanho_kb:.1f} KB)")
    if len(arquivos) > 10:
        print(f"  ... e mais {len(arquivos) - 10} arquivos")