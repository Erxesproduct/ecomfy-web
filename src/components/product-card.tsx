import Image from "next/image";
import Link from "next/link";
import { ageLabel, available, choiceLabel, cover, discount, fromPrice, second, singleVariant, TONE, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { CardActions } from "./card-actions";

export function ProductCard({ p }: { p: Product }) {
  const img = cover(p);
  const img2 = second(p);
  const out = !available(p);
  const off = discount(p);
  const price = fromPrice(p);
  const was = p.variants.find((v) => v.price === price)?.compareAt ?? null;
  const choices = choiceLabel(p);
  const age = ageLabel(p);
  const tone = TONE[p.group] ?? TONE.toys;
  const many = new Set(p.variants.map((v) => v.price)).size > 1;
  return (
    <article className="group relative flex flex-col">
      <Link href={`/p/${p.slug}`} className={`relative block aspect-square overflow-hidden rounded-[24px] bg-white ring-2 ring-line transition group-hover:-translate-y-1 group-hover:shadow-[0_6px_0_var(--color-line)]`}>
        {img && (
          <Image
            src={img.src}
            alt={p.title}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition duration-700 group-hover:scale-[1.05] ${out ? "opacity-55 grayscale-[.6]" : ""} ${img2 ? "group-hover:opacity-0" : ""}`}
          />
        )}
        {img2 && <Image src={img2.src} alt="" fill sizes="(min-width: 1280px) 300px, 50vw" className="object-cover opacity-0 transition duration-700 group-hover:scale-[1.05] group-hover:opacity-100" />}
        <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {out ? (
            <span className="tag bg-white text-ink-2 ring-1 ring-line">Дууссан</span>
          ) : (
            <>
              {off > 0 && <span className="tag bg-tomato text-white">−{off}%</span>}
              {p.order && <span className="tag bg-teal text-white">Захиалгаар</span>}
              {p.best >= 0 && p.best < 12 && <span className="tag bg-sun text-ink">★ Эрэлттэй</span>}
            </>
          )}
        </span>
        {age && <span className={`tag absolute bottom-3 left-3 ${tone.bg} text-white shadow-sm`}>{age}</span>}
      </Link>
      <CardActions slug={p.slug} variantId={out ? null : singleVariant(p)} title={p.title} />
      <div className="mt-3 px-1">
        <p className={`display flex items-center gap-1.5 text-[12px] font-semibold ${tone.text}`}>
          <span className={`h-2 w-2 rounded-[3px] ${tone.bg}`} aria-hidden />
          {p.sub}
          {choices && <span className="font-medium text-ink-3">· {choices}</span>}
        </p>
        <Link href={`/p/${p.slug}`} className="mt-1 line-clamp-2 text-[15px] leading-snug font-medium hover:underline hover:decoration-2 hover:underline-offset-2">
          {p.title}
        </Link>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
          <span className={`display text-[18px] font-bold tracking-tight tabular-nums ${off ? "text-tomato-d" : "text-plum"}`}>
            {formatPrice(price)}
            {many && <span className="ml-1 text-[12.5px] font-medium text-ink-3">-с</span>}
          </span>
          {was && <s className="text-[13px] text-ink-3 tabular-nums">{formatPrice(was)}</s>}
        </p>
      </div>
    </article>
  );
}
