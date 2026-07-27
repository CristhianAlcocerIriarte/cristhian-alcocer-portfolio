import fs from "node:fs";
import path from "node:path";

const repoName = "cristhian-alcocer-portfolio";
const siteDir = path.resolve("site");
const targetDir = path.join(siteDir, repoName);
const outDir = path.resolve("out");

if (!fs.existsSync(outDir)) {
  console.error('Missing "out/" folder. Run "npm run build" first.');
  process.exit(1);
}

fs.rmSync(siteDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(outDir, targetDir, { recursive: true });

console.log(`Prepared static site at ${targetDir}`);
