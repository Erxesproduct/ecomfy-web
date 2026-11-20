import "server-only";

import data from "@/data/catalog.json";

export type Variant = {
  /** "<zochilProductId>" or "<zochilProductId>-<zochilVariantId>". erxes product code EC-<id>. */
  id: string;
  /** option values joined («Ягаан», «40см»), null for products without options */
  label: string | null;
  opts: Record<string, string>;
  price: number;
  compareAt: number | null;
  /** Zochil stock (per product, shared by its variants); null = not counted (orderable), 0 = sold out */
  stock: number | null;
};
export type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };
export type Option = { title: string; values: string[] };
export type Product = {
  id: number;
  slug: string;
  title: string;
  /** montessori | toys | school | desk | kawaii | gifts */
  group: string;
  sub: string;
  /** what it trains, from the shop's Montessori / school categories */
  skills: string[];
  /** 0-1 | 1-3 | 3-5 | 6+, from the shop's «Насны ангиллаар» */
  ages: string[];
  /** the shop's «Захиалгаар» category: made to order */
  order: boolean;
  lines: string[];
  options: Option[];
  variants: Variant[];
  /** place on the shop's own bestseller list, -1 when not on it */
  best: number;
  createdAt: string;
  images: Photo[];
};
export type Group = { id: string; name: string; line: string; count: number; subs: { name: string; count: number }[] };
export type Tag = { id: string; name: string; count: number };

export const products = data.products as Product[];
export const groups = data.groups as Group[];
export const skills = data.skills as Tag[];
export const ages = data.ages as Tag[];
export const shop = data.shop;
export const catalogInfo = { source: data.source, shopId: data.shopId, updatedAt: data.updatedAt };

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getVariant = (id: string) => byVariant.get(id);
export const getGroup = (id: string) => groups.find((g) => g.id === id);
export const getSkill = (id: string) => skills.find((c) => c.id === id);
export const getAge = (id: string) => ages.find((a) => a.id === id);
export const sku = (id: string) => `EC-${id}`;

export const soldOut = (v: Pick<Variant, "stock">) => v.stock === 0;
export const available = (p: Product) => p.variants.some((v) => !soldOut(v));
export const fromPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const onSale = (p: Product) => p.variants.some((v) => v.compareAt);
export const discount = (p: Product) => Math.max(0, ...p.variants.map((v) => (v.compareAt ? Math.round((1 - v.price / v.compareAt) * 100) : 0)));
export const singleVariant = (p: Product) => (p.variants.length === 1 && !soldOut(p.variants[0]) ? p.variants[0].id : null);
export const cover = (p: Product) => p.images[0]?.thumb ?? null;
export const second = (p: Product) => p.images[1]?.thumb ?? null;
/** «3 төрөл», «4 хэмжээ» on a card */
export const choiceLabel = (p: Product) => (p.options.length === 1 && p.options[0].values.length > 1 ? `${p.options[0].values.length} ${p.options[0].title.toLowerCase()}` : null);
/** «3–5 нас», «1–6+ нас» */
export const ageLabel = (p: Product) => {
  if (!p.ages.length) return null;
  const order = ["0-1", "1-3", "3-5", "6+"];
  const a = [...p.ages].sort((x, y) => order.indexOf(x) - order.indexOf(y));
  const from = a[0].split("-")[0].replace("+", "");
  const last = a.at(-1)!;
  const to = last === "6+" ? "6+" : last.split("-")[1];
  return from === to || last === "6+" && from === "6" ? `${from === "6" ? "6+" : from} нас` : `${from}–${to} нас`;
};

/** In stock first, then the shop's bestseller order, then newest. */
const rank = (p: Product) => (p.best < 0 ? 999 : p.best);
export const byPopularity = (a: Product, b: Product) => Number(available(b)) - Number(available(a)) || rank(a) - rank(b) || Number(b.images.length > 0) - Number(a.images.length > 0) || b.createdAt.localeCompare(a.createdAt) || b.id - a.id;
export const popular = [...products].sort(byPopularity);
export const bestsellers = popular.filter((p) => p.best >= 0 && available(p));
export const newest = [...products].filter(available).sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);

/** One toy-box colour per group. */
export const TONE: Record<string, { bg: string; soft: string; text: string; ring: string; hex: string }> = {
  montessori: { bg: "bg-leaf", soft: "bg-leaf-l", text: "text-leaf-d", ring: "ring-leaf", hex: "#3fae49" },
  toys: { bg: "bg-tomato", soft: "bg-tomato-l", text: "text-tomato-d", ring: "ring-tomato", hex: "#ff6b4a" },
  school: { bg: "bg-sky", soft: "bg-sky-l", text: "text-sky-d", ring: "ring-sky", hex: "#2fa8f0" },
  desk: { bg: "bg-teal", soft: "bg-teal-l", text: "text-teal-d", ring: "ring-teal", hex: "#14b8a6" },
  kawaii: { bg: "bg-bubble", soft: "bg-bubble-l", text: "text-bubble-d", ring: "ring-bubble", hex: "#ff6fb5" },
  gifts: { bg: "bg-sun", soft: "bg-sun-l", text: "text-sun-d", ring: "ring-sun", hex: "#ffc23c" },
};
/** Age blocks, like a stack of wooden blocks. */
export const AGE_TONE: Record<string, string> = { "0-1": "bg-bubble", "1-3": "bg-sun", "3-5": "bg-leaf", "6+": "bg-sky" };
