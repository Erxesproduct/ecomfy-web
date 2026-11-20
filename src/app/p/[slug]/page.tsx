import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { ClockIcon, QrIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { ProductBuy } from "@/components/product-buy";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { AGE_TONE, available, byPopularity, fromPrice, getAge, getGroup, getProduct, getSkill, products, sku, TONE, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const text = p.lines.find((l) => l.length > 20);
  const description = (text ?? `${p.title}: ${getGroup(p.group)?.name}`).slice(0, 160);
  return { title: p.title, description, alternates: { canonical: `/p/${p.slug}` }, openGraph: { title: p.title, description, images: p.images[0] ? [{ url: p.images[0].src }] : undefined } };
}

const HEAD = /^(онцлог|давуу тал|үйлчилгээ|хэмжээ|материал|бүрдэл|багцад|хэрэглэх|анхааруулга|нас|хөгжүүлэх|тохиромжтой|багц|иж бүрдэл|үзүүлэлт|хэрхэн тоглох|тоглох арга)/i;

/** The shop's text: a short line ending in «:» (or a known heading word) starts a block; short lines become a list. */
function Story({ lines }: { lines: string[] }) {
  const blocks: { h: string | null; items: string[] }[] = [{ h: null, items: [] }];
  for (const l of lines) {
    const m = l.match(/^(.{3,40}?):\s*(.+)$/);
    if (m && HEAD.test(m[1])) blocks.push({ h: m[1], items: [m[2]] });
    else if ((/:$/.test(l) && l.length < 50) || (HEAD.test(l) && l.length < 40)) blocks.push({ h: l.replace(/:$/, ""), items: [] });
    else blocks.at(-1)!.items.push(l);
  }
  return (
    <div className="space-y-6">
      {blocks
        .filter((b) => b.h || b.items.length)
        .map((b, i) => (
          <div key={i}>
            {b.h && <h3 className="text-[18px] font-bold tracking-tight text-plum">{b.h}</h3>}
            {b.items.length > 0 &&
              (b.items.length > 1 && b.items.every((x) => x.length < 140) ? (
                <ul className="mt-2.5 space-y-2">
                  {b.items.map((x) => (
                    <li key={x} className="flex gap-3 text-[15px] text-ink-2">
                      <span className="mt-[8px] h-2 w-2 shrink-0 rounded-[3px] bg-sun" />
                      {x.replace(/^\d+[.)]\s*/, "")}
                    </li>
                  ))}
                </ul>
              ) : (
                b.items.map((x) => (
                  <p key={x} className="mt-2 text-[15px] text-ink-2">
                    {x}
                  </p>
                ))
              ))}
          </div>
        ))}
    </div>
  );
}

function related(p: Product) {
  const pool = products.filter((x) => x.id !== p.id && available(x));
  const sameSub = pool.filter((x) => x.group === p.group && x.sub === p.sub);
  const sameAge = pool.filter((x) => !sameSub.includes(x) && x.group === p.group && x.ages.some((a) => p.ages.includes(a)));
  const sameGroup = pool.filter((x) => !sameSub.includes(x) && !sameAge.includes(x) && x.group === p.group);
  return [...sameSub.sort(byPopularity), ...sameAge.sort(byPopularity), ...sameGroup.sort(byPopularity)].slice(0, 12);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const rel = related(p);
  const group = getGroup(p.group);
  const tone = TONE[p.group] ?? TONE.toys;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    sku: sku(String(p.id)),
    image: p.images.slice(0, 3).map((i) => absoluteUrl(i.src)),
    description: p.lines.slice(0, 3).join(" "),
    offers: {
      "@type": "Offer",
      priceCurrency: "MNT",
      price: fromPrice(p),
      availability: available(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/p/${p.slug}`),
    },
  };
  const counted = p.variants.find((v) => v.stock != null && v.stock > 0)?.stock ?? null;

  return (
    <div className="wrap pt-5 pb-28 md:pt-8 md:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Зам" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
        <Link href="/shop" className="hover:text-ink">
          Дэлгүүр
        </Link>
        <span>/</span>
        <Link href={`/shop?g=${p.group}`} className="hover:text-ink">
          {group?.name}
        </Link>
        <span>/</span>
        <Link href={`/shop?g=${p.group}&s=${encodeURIComponent(p.sub)}`} className="hover:text-ink">
          {p.sub}
        </Link>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-[180px] lg:self-start">
          <Gallery photos={p.images} title={p.title} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Link href={`/shop?g=${p.group}`} className={`tag ${tone.bg} text-white hover:brightness-105`}>
              {group?.name}
            </Link>
            {p.order && <span className="tag bg-teal-l text-teal-d">Захиалгаар ирнэ</span>}
            {!available(p) && <span className="tag bg-paper text-ink-2">Дууссан</span>}
            {available(p) && counted != null && counted <= 3 && <span className="tag bg-tomato-l text-tomato-d">Цөөхөн үлдсэн</span>}
            {p.best >= 0 && p.best < 12 && <span className="tag bg-sun text-ink">★ Эрэлттэй</span>}
          </div>
          <h1 className="mt-3 text-[32px] text-ink md:text-[46px]">{p.title}</h1>

          {(p.ages.length > 0 || p.skills.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {p.ages.map((a) => (
                <Link key={a} href={`/shop?a=${a}`} className={`display rounded-xl ${AGE_TONE[a]} px-3 py-1.5 text-[13.5px] font-bold text-white shadow-[0_3px_0_rgb(0_0_0/0.15)] hover:brightness-105`}>
                  {getAge(a)?.name}
                </Link>
              ))}
              {p.skills.map((k) => (
                <Link key={k} href={`/shop?k=${k}`} className="display rounded-xl bg-white px-3 py-1.5 text-[13.5px] font-semibold text-plum ring-2 ring-line hover:ring-plum">
                  {getSkill(k)?.name}
                </Link>
              ))}
            </div>
          )}

          <ProductBuy slug={p.slug} title={p.title} options={p.options} variants={p.variants} />

          {p.order && <p className="mt-6 rounded-[20px] bg-teal-l p-4 text-[14px] text-ink-2">{business.rules.order}</p>}

          {p.lines.length > 0 && (
            <section className="mt-8 border-t-2 border-line pt-7" aria-label="Тайлбар">
              <Story lines={p.lines} />
            </section>
          )}

          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {[
              { Icon: TruckIcon, t: `${business.zone.name}: ${formatPrice(business.zone.price)}`, d: `${formatPrice(business.zone.freeOver)}-өөс дээш үнэгүй`, c: "bg-sky-l text-sky-d" },
              { Icon: ClockIcon, t: "24 цагийн дотор", d: "Захиалга баталгаажсанаас хойш", c: "bg-sun-l text-sun-d" },
              { Icon: QrIcon, t: "QPay, 100%", d: "И-баримт erxes-ээс албан ёсоор", c: "bg-leaf-l text-leaf-d" },
              { Icon: ShieldIcon, t: "12 цагт солих", d: "Задлаагүй, хэрэглээгүй бол дэлгүүр дээр", c: "bg-bubble-l text-bubble-d" },
            ].map(({ Icon, t, d, c }) => (
              <li key={t} className="flex gap-3 rounded-[20px] bg-white p-4 ring-2 ring-line">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${c}`}>
                  <Icon size={19} />
                </span>
                <span className="text-[13.5px] text-ink-2">
                  <b className="display block text-[14.5px] font-semibold text-ink">{t}</b>
                  {d}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-ink-3">Код: {sku(String(p.id))}</p>
        </div>
      </div>

      {rel.length > 0 && (
        <section className="mt-20" aria-labelledby="rel">
          <h2 id="rel" className="text-[28px] text-ink md:text-[38px]">
            Үүнтэй <span className={`script ${tone.text}`}>хамт</span> үзээрэй
          </h2>
          <Scroller label="Төстэй бараа" className="snap-row no-scrollbar -mx-4 mt-6 px-4 pb-3 md:mx-0 md:px-0">
            {rel.map((x) => (
              <div key={x.id} className="w-[46vw] max-w-[260px] sm:w-[230px]">
                <ProductCard p={x} />
              </div>
            ))}
          </Scroller>
        </section>
      )}
    </div>
  );
}
