// Actualiza los años de experiencia del README (año actual - año de inicio).
// Uso local con otra fecha:  FAKE_DATE=2027-01-01 README_PATH=copia.md node update-experience.mjs
import { readFileSync, writeFileSync } from "node:fs";

const START_YEAR = 2020;
const README = process.env.README_PATH || "README.md";
const now = process.env.FAKE_DATE ? new Date(`${process.env.FAKE_DATE}T12:00:00Z`) : new Date();
const years = now.getUTCFullYear() - START_YEAR;
const today = now.toISOString().slice(0, 10);

let md = readFileSync(README, "utf8");

// Cada patrón debe aparecer exactamente una vez; si el README cambia y deja de coincidir, falla en vez de no hacer nada.
const rules = [
  { name: "badge de experiencia", re: /(Experience-)\d+(%2B%20Years)/g },
  { name: "texto del About", re: /(\*\*)\d+(\+ years\*\*)/g },
];
for (const { name, re } of rules) {
  const found = md.match(re) || [];
  if (found.length !== 1) {
    console.error(`Se esperaba 1 coincidencia para "${name}" y hubo ${found.length}.`);
    process.exit(1);
  }
  md = md.replace(re, (_, before, after) => `${before}${years}${after}`);
}

// Marca de revisión (invisible al renderizar): también mantiene activo el repositorio.
const stamp = `<!-- experience-checked: ${today} -->`;
const marker = /<!-- experience-checked: [\d-]+ -->/;
md = marker.test(md) ? md.replace(marker, stamp) : `${md.trimEnd()}\n\n${stamp}\n`;

writeFileSync(README, md);
console.log(`Años de experiencia: ${years} (fecha usada: ${today})`);
