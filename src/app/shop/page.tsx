import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "@/components/brand";
import { CloseIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { AGE_TONE, ages, available, byPopularity, discount, fromPrice, getAge, getSkill, groups, onSale, popular, skills, TONE } from "@/lib/catalog";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const PER_PAGE = 48;
const SORTS = [
  { id: "", name: "Эрэлттэй" },
  { id: "new", name: "Шинэ" },
  { id: "low", name: "Үнэ ↑" },
  { id: "high", name: "Үнэ ↓" },
];

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const g = groups.find((x) => x.id === one(sp.g));
  const a = getAge(one(sp.a));
  const title = g ? g.name : a ? `${a.name}ны тоглоом` : "Бүх бараа";
  return { title, description: g ? g.line : "Монтессори тоглоом, ном, бичиг хэрэг, хичээлийн ширээ, бэлэг: eComfy.", alternates: { canonical: g ? `/shop?g=${g.id}` : a ? `/shop?a=${a.id}` : "/shop" } };
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/[.\-/]/g, " ").replace(/\s+/g, " ").trim();

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const f = { g: one(sp.g), s: one(sp.s), a: one(sp.a), k: one(sp.k), sale: one(sp.sale), in: one(sp.in), q: one(sp.q).slice(0, 60), sort: one(sp.sort), page: one(sp.page) };
  const group = groups.find((x) => x.id === f.g);
  const age = getAge(f.a);
  const skill = getSkill(f.k);

  let list = popular.filter((p) => {
    if (group && p.group !== group.id) return false;
    if (f.s && p.sub !== f.s) return false;
    if (age && !p.ages.includes(age.id)) return false;
    if (skill && !p.skills.includes(skill.id)) return false;
    if (f.sale && !(onSale(p) && available(p))) return false;
    if (f.in && !available(p)) return false;
    if (f.q) {
      const hay = norm(`${p.title} ${p.sub} ${p.options.flatMap((o) => o.values).join(" ")}`);
      if (!norm(f.q).split(" ").every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const byAvail = (a: (typeof list)[number], b: (typeof list)[number]) => Number(available(b)) - Number(available(a));
  list =
    f.sort === "new"
      ? [...list].sort((a, b) => byAvail(a, b) || b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
      : f.sort === "low"
        ? [...list].sort((a, b) => byAvail(a, b) || fromPrice(a) - fromPrice(b))
        : f.sort === "high"
          ? [...list].sort((a, b) => byAvail(a, b) || fromPrice(b) - fromPrice(a))
          : [...list].sort((a, b) => byPopularity(a, b) || discount(b) - discount(a));

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number.parseInt(f.page, 10) || 1));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const href = (patch: Partial<typeof f>) => {
    const next = { ...f, page: "", ...patch };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
    const s = q.toString();
    return s ? `/shop?${s}` : "/shop";
  };
  const active = [f.s, f.a, f.k, f.sale, f.in, f.q].some(Boolean);
  const tone = TONE[group?.id ?? ""];
  const title = group ? group.name : age ? `${age.name}` : skill ? skill.name : f.q ? `«${f.q}»` : "Бүх бараа";
  const line = group ? group.line : age ? "Энэ насанд тохирох тоглоом, хэрэгсэл (дэлгүүрийн насны ангиллаар)" : skill ? "Энэ чадварыг хөгжүүлэх тоглоом, хэрэгсэл" : "Монтессори тоглоом, ном, бичиг хэрэг, ширээ, бэлэг";

  return (
    <div className="pb-16">
      <section className={`relative overflow-hidden ${tone ? tone.soft : "bg-paper"} dots`}>
        <Star className={`twinkle absolute top-6 right-[12%] h-8 w-8 ${tone ? tone.text : "text-sun"}`} />
        <Star className="twinkle absolute right-[30%] bottom-6 h-5 w-5 text-sun [animation-delay:1.2s]" />
        <div className="wrap relative pt-8 pb-8 md:pt-12 md:pb-10">
          <p className="eyebrow">{list.length} бараа</p>
          <h1 className={`mt-3 text-[38px] md:text-[60px] ${tone ? tone.text : "text-plum"}`}>{title}</h1>
          <p className="mt-2 max-w-2xl text-[16px] text-ink-2">{line}</p>
        </div>
      </section>

      <div className="wrap">
        <div className="-mx-4 border-b-2 border-line bg-white px-4 py-3 md:mx-0 md:mt-5 md:rounded-[24px] md:border-2 md:px-4">
          <Scroller small label="Ангилал" as="nav" className="no-scrollbar flex gap-2 overflow-x-auto">
            <Link href={href({ g: "", s: "" })} className="chip" aria-current={!group ? "true" : undefined}>
              Бүгд
            </Link>
            {groups.map((g) => (
              <Link key={g.id} href={href({ g: g.id, s: "" })} className="chip" aria-current={group?.id === g.id ? "true" : undefined}>
                <span className={`h-2.5 w-2.5 rounded-[4px] ${TONE[g.id].bg}`} aria-hidden />
                {g.name} <span className="text-[12px] opacity-60">{g.count}</span>
              </Link>
            ))}
          </Scroller>

          <Scroller small label="Нас" className="no-scrollbar mt-2.5 flex items-center gap-1.5 overflow-x-auto">
            <span className="shrink-0 pr-1 text-[13px] text-ink-3">Нас</span>
            {ages.map((a) => (
              <Link key={a.id} href={href({ a: f.a === a.id ? "" : a.id })} className="chip min-h-9 px-3 text-[13.5px]" aria-current={f.a === a.id ? "true" : undefined}>
                <span className={`h-2.5 w-2.5 rounded-[4px] ${AGE_TONE[a.id]}`} aria-hidden />
                {a.name}
              </Link>
            ))}
            <span className="mx-1 h-6 w-px shrink-0 bg-line" aria-hidden />
            <Link href={href({ in: f.in ? "" : "1" })} className="chip min-h-9 px-3 text-[13.5px]" aria-current={f.in ? "true" : undefined}>
              Бэлэн байгаа
            </Link>
            <Link href={href({ sale: f.sale ? "" : "1" })} className="chip min-h-9 px-3 text-[13.5px]" aria-current={f.sale ? "true" : undefined}>
              % Хямдрал
            </Link>
          </Scroller>

          {group && group.subs.length > 1 && (
            <Scroller small label="Төрөл" className="no-scrollbar mt-2 flex items-center gap-1.5 overflow-x-auto">
              <span className="shrink-0 pr-1 text-[13px] text-ink-3">Төрөл</span>
              {group.subs.map((s) => (
                <Link key={s.name} href={href({ s: f.s === s.name ? "" : s.name })} className="chip min-h-9 px-3 text-[13.5px]" aria-current={f.s === s.name ? "true" : undefined}>
                  {s.name}
                </Link>
              ))}
            </Scroller>
          )}

          {(!group || group.id === "montessori" || group.id === "school" || group.id === "toys") && (
            <Scroller small label="Чадвар" className="no-scrollbar mt-2 flex items-center gap-1.5 overflow-x-auto">
              <span className="shrink-0 pr-1 text-[13px] text-ink-3">Хөгжүүлэх</span>
              {skills.map((c) => (
                <Link key={c.id} href={href({ k: f.k === c.id ? "" : c.id })} className="chip min-h-9 px-3 text-[13.5px]" aria-current={f.k === c.id ? "true" : undefined}>
                  {c.name}
                </Link>
              ))}
            </Scroller>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {f.q && (
              <Link href={href({ q: "" })} className="tag gap-1 bg-paper py-1.5 text-[13.5px] text-ink">
                «{f.q}» <CloseIcon size={13} />
              </Link>
            )}
            {active && (
              <Link href={href({ s: "", a: "", k: "", sale: "", in: "", q: "" })} className="text-[14px] font-semibold text-tomato-d hover:underline">
                Шүүлтүүр арилгах
              </Link>
            )}
          </div>
          <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-paper p-1" role="group" aria-label="Эрэмбэ">
            {SORTS.map((s) => (
              <Link key={s.id} href={href({ sort: s.id })} aria-current={f.sort === s.id ? "true" : undefined} className={`display shrink-0 rounded-xl px-3 py-1.5 text-[13.5px] font-medium ${f.sort === s.id ? "bg-white shadow-[0_2px_0_var(--color-line)]" : "text-ink-2"}`}>
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        {shown.length ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
              {shown.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
            {pages > 1 && (
              <nav aria-label="Хуудас" className="mt-12 flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <Link key={n} href={href({ page: n === 1 ? "" : String(n) })} aria-current={n === page ? "page" : undefined} className={`display grid h-11 min-w-11 place-items-center rounded-xl px-3 font-bold tabular-nums ${n === page ? "bg-plum text-white shadow-[0_3px_0_#2a0d2e]" : "bg-white ring-2 ring-line hover:ring-plum"}`}>
                    {n}
                  </Link>
                ))}
              </nav>
            )}
          </>
        ) : (
          <div className="card mx-auto mt-10 max-w-lg p-10 text-center">
            <Star className="mx-auto h-11 w-11 text-sun" />
            <p className="display mt-5 text-[24px] font-bold tracking-tight">Энэ сонголтоор бараа олдсонгүй</p>
            <p className="mt-2 text-ink-2">Шүүлтүүрээ багасгаад үзээрэй, эсвэл 8878-8757 дугаарт залгаарай.</p>
            <Link href="/shop" className="btn btn-plum mt-6">
              Бүх бараа
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
