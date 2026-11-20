import Image from "next/image";
import Link from "next/link";
import { Star, Sun, Train } from "@/components/brand";
import { ArrowIcon, PinIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Scroller } from "@/components/scroller";
import { Search } from "@/components/search";
import { business, posts } from "@/content/business";
import { AGE_TONE, ages, bestsellers, fromPrice, groups, popular, products, skills, TONE, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const SKILL_ICON: Record<string, string> = { letters: "🔤", think: "🧠", hands: "✋", puzzle: "🧩", role: "🎭", life: "🧺", together: "👫", art: "🎨", music: "🎵" };
/** The shop's post «Хүүхэд өдөрт хэдэн цаг дэлгэц хэрэглэвэл зохистой вэ?», as four blocks. */
const SCREEN = [
  { age: "0–2 нас", time: "Огт үгүй", note: "Хэл яриа, харилцааны суурь тавигдах үе", tone: "bg-bubble" },
  { age: "3–6 нас", time: "35 мин – 1 цаг", note: "Насандаа тохирсон контентийг хамт сууж үзнэ", tone: "bg-sun" },
  { age: "7–12 нас", time: "≤ 1 ц 30 мин", note: "2 цаг цахим хичээл үзсэн бол нэмэлт дэлгэцгүй", tone: "bg-leaf" },
  { age: "13–18 нас", time: "≤ 2 ц 30 мин", note: "2–3 удаа тасалж, амралттай", tone: "bg-sky" },
];

function Shelf({ id, title, accent, line, href, items, tone = "text-tomato" }: { id: string; title: string; accent: string; line?: string; href: string; items: Product[]; tone?: string }) {
  if (!items.length) return null;
  return (
    <Reveal as="section" className="wrap mt-20 md:mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={id} className="text-[30px] text-ink md:text-[44px]">
            {title} <span className={`script ${tone}`}>{accent}</span>
          </h2>
          {line && <p className="mt-2 text-ink-2">{line}</p>}
        </div>
        <Link href={href} className="display inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-[15px] font-semibold ring-2 ring-line hover:ring-plum">
          Бүгдийг үзэх <ArrowIcon size={16} />
        </Link>
      </div>
      <Scroller label={`${title} ${accent}`} className="snap-row no-scrollbar -mx-4 mt-6 px-4 pt-1 pb-3 md:mx-0 md:px-0">
        {items.map((p) => (
          <div key={p.id} className="w-[46vw] max-w-[270px] sm:w-[240px]">
            <ProductCard p={p} />
          </div>
        ))}
      </Scroller>
    </Reveal>
  );
}

/** A product photo in a white circle with a coloured ring, bobbing (the banner's round photo frames). */
function Bubble({ p, className, ring, delay, size, priority = false }: { p: Product; className: string; ring: string; delay: string; size: string; priority?: boolean }) {
  return (
    <Link href={`/p/${p.slug}`} className={`bob group absolute block ${className}`} style={{ animationDelay: delay, ["--r" as string]: "2deg" }} aria-label={p.title}>
      <span className={`relative block overflow-hidden rounded-full bg-white ring-[6px] ${ring} shadow-[0_18px_40px_-14px_rgb(20_0_40/0.55)] transition group-hover:scale-105`}>
        <Image src={p.images[0].thumb.src} alt="" width={460} height={460} priority={priority} sizes={size} className="aspect-square h-full w-full object-cover" />
      </span>
    </Link>
  );
}

export default function Home() {
  const withPhoto = bestsellers.filter((p) => p.images.length);
  // Hero photos: the shop's bestsellers that read well as round, colourful photos (busy book, wooden elephant,
  // tetris puzzle, rainbow tower, desk set: ranks in the shop's own list), topped up from the rest if one goes away.
  const hero: Product[] = [];
  for (const rank of [0, 1, 3, 11, 9]) {
    const p = withPhoto.find((x) => x.best === rank);
    if (p) hero.push(p);
  }
  for (const p of withPhoto) if (hero.length < 5 && !hero.includes(p)) hero.push(p);
  const star = hero[0];
  const deskPost = posts.find((p) => /ширээ/i.test(p.title));
  const desks = popular.filter((p) => p.group === "desk" && p.images.length).slice(0, 4);
  const montessori = popular.filter((p) => p.group === "montessori");
  const gifts = popular.filter((p) => p.group === "gifts" || p.group === "kawaii");
  const agePicsUsed = new Set<number>(); // each age block shows its own photos

  return (
    <>
      {/* Hero: the banner's violet→teal starry sky, product photos floating in rings around a smiling sun */}
      <section className="sky stars relative overflow-hidden text-white">
        <Star className="twinkle absolute top-10 left-[46%] h-6 w-6 text-sun" />
        <Star className="twinkle absolute top-[60%] left-[6%] h-4 w-4 text-white [animation-delay:.8s]" />
        <Star className="twinkle absolute top-[18%] left-[4%] h-5 w-5 text-bubble [animation-delay:1.6s]" />
        <div className="wrap relative grid gap-6 pt-10 pb-36 md:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-40">
          <div className="relative z-10">
            <p className="eyebrow text-plum">
              <Star className="h-3.5 w-3.5 text-sun" /> {business.motto}
            </p>
            <h1 className="mt-5 text-[44px] leading-[1] sm:text-[60px] lg:text-[74px]">
              Тоглоод <span className="script text-sun">сурдаг</span> хүүхдийн дэлгүүр
            </h1>
            <p className="mt-5 max-w-lg text-[17px] text-white/85">
              Монтессори тоглоом, ном, хичээлийн ширээ, бэлэг. {products.length} бараа, 24 цагт хүргэнэ, {formatPrice(business.zone.freeOver)}-өөс дээш үнэгүй.
            </p>
            <Search className="mt-7 max-w-lg" />
            <p className="display mt-7 text-[15px] font-semibold text-white/90">Хүүхэд тань хэдэн настай вэ?</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {ages.map((a, i) => (
                <Link key={a.id} href={`/shop?a=${a.id}`} className={`display wiggle rounded-2xl ${AGE_TONE[a.id]} px-4 py-3 text-[16px] font-extrabold ${a.id === "1-3" ? "text-ink" : "text-white"} shadow-[0_5px_0_rgb(0_0_0/0.25)] transition hover:-translate-y-1`} style={{ rotate: `${[-3, 2, -2, 3][i]}deg` }}>
                  {a.name}
                </Link>
              ))}
            </div>
          </div>

          {/* the toy orbit */}
          <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-label="Эрэлттэй бараа">
            <div className="absolute inset-[8%] rounded-full border-2 border-dashed border-white/25" />
            <div className="absolute inset-[24%] rounded-full bg-white/10" />
            <Sun className="absolute top-[-2%] right-[2%] w-[24%]" />
            <Bubble p={star} priority className="top-[22%] left-[22%] w-[56%]" ring="ring-sun" delay="0s" size="(min-width: 1024px) 290px, 56vw" />
            <Bubble p={hero[1]} className="top-[4%] left-[6%] w-[26%]" ring="ring-tomato" delay="-1.2s" size="140px" />
            <Bubble p={hero[2]} className="top-[64%] left-[2%] w-[27%]" ring="ring-sky" delay="-2.4s" size="140px" />
            <Bubble p={hero[3]} className="top-[70%] right-[6%] w-[25%]" ring="ring-leaf" delay="-3.1s" size="130px" />
            <Bubble p={hero[4]} className="top-[30%] right-[-2%] w-[21%]" ring="ring-bubble" delay="-.6s" size="110px" />
            <Image src="/brand/logo.webp" alt="eComfy" width={160} height={160} className="absolute bottom-[2%] left-[34%] w-[22%] rotate-[-10deg] rounded-full shadow-[0_8px_0_rgb(0_0_0/0.2)]" />
            <Link href={`/p/${star.slug}`} className="display absolute top-[20%] left-[54%] rotate-[8deg] rounded-2xl bg-white px-3 py-2 text-ink shadow-[0_5px_0_rgb(0_0_0/0.2)]">
              <span className="block text-[11px] font-semibold text-tomato-d">★ Хамгийн эрэлттэй</span>
              <span className="block text-[17px] leading-tight font-extrabold">{formatPrice(fromPrice(star))}</span>
            </Link>
          </div>
        </div>
        {/* a wooden train rolls along the track */}
        <div className="absolute inset-x-0 bottom-0 h-[92px] overflow-hidden" aria-hidden>
          <div className="absolute inset-x-0 bottom-[14px] h-[6px] bg-[repeating-linear-gradient(90deg,#c98a4b_0_26px,transparent_26px_40px)] opacity-80" />
          <div className="absolute inset-x-0 bottom-[10px] h-[4px] bg-white/30" />
          <Train className="choo absolute bottom-[16px] left-0 w-[260px] md:w-[320px]" />
        </div>
      </section>

      {/* Groups: one coloured toy block each */}
      <section className="wrap mt-16 md:mt-24" aria-labelledby="groups">
        <Reveal>
          <h2 id="groups" className="text-[32px] text-ink md:text-[48px]">
            Юу <span className="script text-leaf">хайж</span> байна?
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => {
            const t = TONE[g.id];
            const pics = popular.filter((p) => p.group === g.id && p.images.length).slice(0, 3);
            return (
              <Reveal key={g.id} delay={(i % 3) * 80}>
                <div className={`group relative flex h-full flex-col overflow-hidden rounded-[30px] ${t.bg} p-5 text-white shadow-[0_6px_0_rgb(0_0_0/0.14)] transition hover:-translate-y-1 md:p-6 ${g.id === "gifts" ? "text-ink" : ""}`}>
                  <div className="stars absolute inset-0 opacity-60" />
                  <Link href={`/shop?g=${g.id}`} className="relative flex items-center gap-2">
                    {pics.map((p, k) => (
                      <span key={p.id} className="relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-full bg-white ring-4 ring-white/70 transition group-hover:rotate-[-4deg]" style={{ marginLeft: k ? -18 : 0, zIndex: 3 - k }}>
                        <Image src={p.images[0].thumb.src} alt="" fill sizes="74px" className="object-cover" />
                      </span>
                    ))}
                    <span className="display ml-auto rounded-xl bg-white/90 px-3 py-1 text-[13px] font-bold text-ink">{g.count} бараа</span>
                  </Link>
                  <h3 className="relative mt-5 text-[27px]">
                    <Link href={`/shop?g=${g.id}`}>{g.name}</Link>
                  </h3>
                  <p className={`relative mt-1 text-[14.5px] ${g.id === "gifts" ? "text-ink/75" : "text-white/85"}`}>{g.line}</p>
                  <div className="relative mt-4 flex flex-wrap gap-1.5">
                    {g.subs
                      .filter((s) => s.name !== "Бусад")
                      .slice(0, 5)
                      .map((s) => (
                        <Link key={s.name} href={`/shop?g=${g.id}&s=${encodeURIComponent(s.name)}`} className="display rounded-xl bg-white/20 px-3 py-1.5 text-[13px] font-medium backdrop-blur transition hover:bg-white hover:text-ink">
                          {s.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Shelf id="best" title="Хамгийн" accent="эрэлттэй" line="Дэлгүүрийн өөрийн шилдэг жагсаалтаас" href="/shop" items={withPhoto.slice(0, 12)} tone="text-tomato" />

      {/* Ages: wooden blocks */}
      <section id="ages" className="mt-20 scroll-mt-40 md:mt-28" aria-labelledby="ages-h">
        <div className="wrap">
          <Reveal className="dots rounded-[36px] bg-paper p-6 md:p-12">
            <h2 id="ages-h" className="text-[32px] text-ink md:text-[48px]">
              Насаар нь <span className="script text-sky">сонгоё</span>
            </h2>
            <p className="mt-2 max-w-xl text-ink-2">Дэлгүүрийн насны ангиллаар: нэг дарахад тухайн насанд тохирох бүх тоглоом.</p>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {ages.map((a, i) => {
                const pics = popular.filter((p) => p.ages.includes(a.id) && p.images.length && !agePicsUsed.has(p.id)).slice(0, 2);
                pics.forEach((p) => agePicsUsed.add(p.id));
                return (
                  <Link key={a.id} href={`/shop?a=${a.id}`} className={`group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-[26px] ${AGE_TONE[a.id]} p-5 pt-24 md:pt-28 shadow-[0_6px_0_rgb(0_0_0/0.16)] transition hover:-translate-y-1.5 ${a.id === "1-3" ? "text-ink" : "text-white"}`} style={{ rotate: `${[-1.5, 1, -1, 1.5][i]}deg` }}>
                    <span className="absolute top-3 right-3 flex">
                      {pics.map((p, k) => (
                        <span key={p.id} className="relative -ml-5 h-16 w-16 overflow-hidden rounded-full bg-white ring-4 ring-white/70 transition group-hover:scale-105 first:ml-0 md:h-20 md:w-20" style={{ zIndex: k }}>
                          <Image src={p.images[0].thumb.src} alt="" fill sizes="96px" className="object-cover" />
                        </span>
                      ))}
                    </span>
                    <span className="display relative text-[44px] leading-none font-extrabold md:text-[54px]">{a.name.replace(" нас", "")}</span>
                    <span className="display relative mt-1 text-[15px] font-semibold">
                      нас · {a.count} бараа →
                    </span>
                  </Link>
                );
              })}
            </div>
            <p className="display mt-10 text-[17px] font-bold text-ink">Юу хөгжүүлэх вэ?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((s) => (
                <Link key={s.id} href={`/shop?k=${s.id}`} className="display inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-[15px] font-semibold text-ink shadow-[0_3px_0_var(--color-line)] ring-2 ring-line transition hover:-translate-y-0.5 hover:ring-plum">
                  <span aria-hidden>{SKILL_ICON[s.id]}</span>
                  {s.name}
                  <span className="text-[12px] text-ink-3">{s.count}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Shelf id="montessori" title="Монтессори" accent="тоглоом" line="Гарын жижиг булчин, сэтгэхүй, үсэг тоо: тоглоод сурна" href="/shop?g=montessori" items={montessori.slice(0, 12)} tone="text-leaf" />

      {/* Desks: the shop's own advice post + the desks */}
      {desks.length > 0 && deskPost && (
        <Reveal as="section" className="wrap mt-20 md:mt-28">
          <div className="grid overflow-hidden rounded-[36px] bg-teal text-white lg:grid-cols-[1fr_1.2fr]">
            <div className="stars relative p-7 md:p-12">
              <p className="eyebrow text-teal-d">Эцэг эхэд зөвлөмж</p>
              <h2 className="mt-4 text-[30px] md:text-[42px]">
                Хичээлийн ширээ, сандал <span className="script text-sun">хэрхэн</span> сонгох вэ?
              </h2>
              <ol className="mt-6 space-y-4">
                {deskPost.lines.slice(0, 3).map((l, i) => {
                  const m = l.match(/^#\d+\s+(\S+(?:\s\S+)?)\s+(.*)$/);
                  const head = m ? m[1] : null;
                  return (
                    <li key={i} className="flex gap-3">
                      <span className="display grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sun text-[17px] font-extrabold text-ink shadow-[0_3px_0_rgb(0_0_0/0.2)]">{i + 1}</span>
                      <span className="text-[15px] text-white/90">
                        {head && <b className="display block text-[16px] text-white">{head}</b>}
                        {m ? m[2] : l}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <Link href="/shop?g=desk" className="btn btn-sun mt-8">
                Ширээ, сандал үзэх <ArrowIcon size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-teal-d/30 p-4 md:p-6">
              {desks.map((p) => (
                <Link key={p.id} href={`/p/${p.slug}`} className="group overflow-hidden rounded-[22px] bg-white text-ink">
                  <span className="relative block aspect-square overflow-hidden">
                    <Image src={p.images[0].thumb.src} alt={p.title} fill sizes="(min-width: 1024px) 260px, 45vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    {p.order && <span className="tag absolute top-2 left-2 bg-teal text-white">Захиалгаар</span>}
                  </span>
                  <span className="block p-3">
                    <span className="line-clamp-1 text-[14px] font-medium">{p.title}</span>
                    <span className="display text-[16px] font-bold text-plum">{formatPrice(fromPrice(p))}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Screen time: the shop's post */}
      <Reveal as="section" className="wrap mt-20 md:mt-28">
        <div className="card overflow-hidden p-6 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">ДЭМБ, ОУ-ын байгууллагын зөвлөмж</p>
              <h2 className="mt-3 text-[28px] text-ink md:text-[40px]">
                Өдөрт хэдэн цаг <span className="script text-bubble">дэлгэц</span>?
              </h2>
            </div>
            <p className="display text-[16px] font-semibold text-plum">~ Хайртай үрстэйгээ хамтдаа тоглоё ~</p>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {SCREEN.map((s) => (
              <div key={s.age} className={`rounded-[22px] ${s.tone} p-5 ${s.tone === "bg-sun" ? "text-ink" : "text-white"} shadow-[0_5px_0_rgb(0_0_0/0.14)]`}>
                <p className="display text-[14px] font-semibold opacity-85">{s.age}</p>
                <p className="display mt-1 text-[22px] leading-tight font-extrabold md:text-[26px]">{s.time}</p>
                <p className="mt-2 text-[13px] opacity-85">{s.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[14.5px] text-ink-2">Дэлгэцийн оронд гараараа хийж, хамт тоглох зүйл хэрэгтэй юу?{" "}
            <Link href="/shop?k=together" className="font-semibold text-plum underline underline-offset-4">
              Олуулаа тоглох тоглоом
            </Link>
          </p>
        </div>
      </Reveal>

      <Shelf id="gifts" title="Бэлэг ба" accent="kawaii" line="Бэлгийн багц, аяга, blind box, Sanrio" href="/shop?g=gifts" items={gifts.slice(0, 12)} tone="text-bubble" />

      {/* Visit */}
      <Reveal as="section" className="wrap mt-20 md:mt-28">
        <div className="grid gap-6 overflow-hidden rounded-[36px] bg-plum p-7 text-white md:grid-cols-[auto_1fr_auto] md:items-center md:p-10">
          <Image src="/brand/logo.webp" alt="" width={120} height={120} className="h-24 w-24 rounded-full md:h-28 md:w-28" />
          <div>
            <h2 className="text-[28px] md:text-[36px]">
              Дэлгүүр дээр ирж <span className="script text-sun">тоглоорой</span>
            </h2>
            <p className="mt-2 flex items-start gap-2 text-white/85">
              <PinIcon size={18} className="mt-1 shrink-0 text-sun" /> {business.store.name}: {business.store.address}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${business.phone.tel}`} className="btn btn-sun">
              {business.phone.display}
            </a>
            <Link href="/info#store" className="btn bg-white/12 text-white ring-2 ring-white/20 hover:bg-white/20">
              Дэлгэрэнгүй
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="wrap mt-10 grid gap-3 sm:grid-cols-3">
        {[
          { k: "Хүргэлт", v: `24 цагт, ${formatPrice(business.zone.price)}`, d: `${formatPrice(business.zone.freeOver)}-өөс дээш үнэгүй`, c: "bg-sky-l" },
          { k: "Төлбөр", v: "QPay", d: "Аль ч банкны аппаар", c: "bg-sun-l" },
          { k: "Солих", v: "12 цагийн дотор", d: "Задлаагүй, хэрэглээгүй бол", c: "bg-bubble-l" },
        ].map((x) => (
          <div key={x.k} className={`rounded-[24px] ${x.c} p-5`}>
            <p className="display text-[13px] font-semibold text-ink-3">{x.k}</p>
            <p className="display mt-1 text-[21px] font-extrabold tracking-tight text-ink">{x.v}</p>
            <p className="text-[14px] text-ink-2">{x.d}</p>
          </div>
        ))}
      </Reveal>
    </>
  );
}
