// node scripts/export-erxes.mjs → docs/erxes/ecomfy-{categories,products,delivery}.csv
// Files for erxes Products & Services import (Settings → Import). Every row comes from src/data/catalog.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const c = JSON.parse(readFileSync(path.join(root, "src/data/catalog.json"), "utf8"));
const out = path.join(root, "docs/erxes");
mkdirSync(out, { recursive: true });

const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
const code = (id) => `EC-${id.toUpperCase()}`;

// categories: EC → the six groups (montessori, toys, school, desk, kawaii, gifts) → their shelves, plus delivery.
// Age and skill are product properties, not categories (one product sits in several ages).
const cats = [["code", "name", "parent code"], ["EC", "eComfy store", ""]];
for (const g of c.groups) {
  cats.push([code(g.id), g.name, "EC"]);
  for (const [i, s] of g.subs.entries()) cats.push([`${code(g.id)}-${i + 1}`, s.name, code(g.id)]);
}
cats.push(["EC-DELIVERY", "Хүргэлт", "EC"]);
writeFileSync(path.join(out, "ecomfy-categories.csv"), csv(cats));

const ageName = (id) => c.ages.find((a) => a.id === id)?.name ?? id;
const skillName = (id) => c.skills.find((s) => s.id === id)?.name ?? id;
const subCode = (p) => {
  const g = c.groups.find((x) => x.id === p.group);
  const i = (g?.subs ?? []).findIndex((s) => s.name === p.sub);
  return i >= 0 ? `${code(p.group)}-${i + 1}` : code(p.group);
};
const rows = [["code", "name", "category code", "type", "unit price", "price before sale", "ages", "skills", "made to order", "options", "stock (Zochil)", "zochil product id", "image (website path)"]];
for (const p of c.products)
  for (const v of p.variants)
    rows.push([
      `EC-${v.id}`,
      [p.title, v.label].filter(Boolean).join(" · ").slice(0, 200),
      subCode(p),
      "product",
      v.price,
      v.compareAt ?? "",
      p.ages.map(ageName).join("; "),
      p.skills.map(skillName).join("; "),
      p.order ? "yes" : "",
      Object.entries(v.opts ?? {}).map(([k, x]) => `${k}=${x}`).join("; "),
      v.stock ?? "",
      p.id,
      p.images[0]?.src ?? "",
    ]);
writeFileSync(path.join(out, "ecomfy-products.csv"), csv(rows));

// the shop's one Zochil delivery option; the payment rule also names a 10,000₮ zone that has no option (owner to confirm)
const z = c.shop.zone;
writeFileSync(
  path.join(out, "ecomfy-delivery.csv"),
  csv([
    ["code", "name", "category code", "type", "unit price", "source"],
    ["EC-DELIVERY-AB", `Хүргэлт: ${z.title} (${z.description})`, "EC-DELIVERY", "service", z.price, `Zochil delivery option; free when the goods come to more than ${z.freeOver}₮.`],
    ["EC-DELIVERY-FAR", "Хүргэлт: алс бүс (эзэн баталгаажуулна)", "EC-DELIVERY", "service", 10000, "Zochil payment rule: «8,000₮–10,000₮ by zone». No Zochil option exists for it: confirm the area before using."],
  ]),
);
console.log(`categories ${cats.length - 1}, products ${rows.length - 1}, delivery 2`);
