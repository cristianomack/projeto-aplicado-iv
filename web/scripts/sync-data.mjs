// Copia o JSON gerado pelo notebook para a pasta pública da SPA (fonte única: data/processed)
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const origem = resolve(aqui, "../../data/processed/painel_hidrico.json");
const destino = resolve(aqui, "../public/dados/painel_hidrico.json");

if (!existsSync(origem)) {
  console.error(`Arquivo não encontrado: ${origem}\nRode o notebook até a seção "Camada de decisão" para gerá-lo.`);
  process.exit(1);
}
mkdirSync(dirname(destino), { recursive: true });
copyFileSync(origem, destino);
console.log("Dados sincronizados:", destino);
