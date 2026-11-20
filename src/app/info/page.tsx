import type { Metadata } from "next";
import { Star } from "@/components/brand";
import { ChatIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, QrIcon, TruckIcon } from "@/components/icons";
import { business, faq, ORDER_STATUSES } from "@/content/business";
import { shop } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, солих",
  description: `${business.zone.name}: ${formatPrice(business.zone.price)}, 24 цагт, ${formatPrice(business.zone.freeOver)}-өөс дээш үнэгүй. QPay. 12 цагийн дотор солих. ${business.store.name}.`,
  alternates: { canonical: "/info" },
};

export default function InfoPage() {
  const blocks = [
    { id: "delivery", Icon: TruckIcon, tone: "bg-sky-l", icon: "bg-sky text-white", title: "Хүргэлт", items: [`${business.zone.name}: ${formatPrice(business.zone.price)}. Барааны дүн ${formatPrice(business.zone.freeOver)}-өөс давбал үнэгүй.`, `Бүсийн хязгаар: ${business.zone.area}.`, business.rules.delivery, business.rules.outside] },
    { id: "payment", Icon: QrIcon, tone: "bg-sun-l", icon: "bg-sun text-ink", title: "Төлбөр", items: [business.rules.payment, "QPay: аль ч банкны аппаар QR уншуулж төлнө.", business.rules.ebarimt] },
    { id: "terms", Icon: ChatIcon, tone: "bg-bubble-l", icon: "bg-bubble text-white", title: "Солих, буцаах", items: [business.rules.terms, business.rules.cancel] },
    { id: "order", Icon: PinIcon, tone: "bg-teal-l", icon: "bg-teal text-white", title: "Захиалгаар ирэх бараа", items: [business.rules.order] },
  ];
  return (
    <div className="pb-28 md:pb-16">
      <section className="sky stars relative overflow-hidden text-white">
        <Star className="twinkle absolute top-8 right-[10%] h-10 w-10 text-sun" />
        <div className="wrap relative pt-10 pb-12 md:pt-14 md:pb-16">
          <p className="eyebrow text-plum">Мэдээлэл</p>
          <h1 className="mt-4 max-w-3xl text-[38px] md:text-[60px]">
            Хүргэлт, төлбөр, <span className="script text-sun">солих</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] text-white/85">{(shop.about as string[])[0]}</p>
        </div>
      </section>

      <div className="wrap">
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {blocks.map(({ id, Icon, tone, icon, title, items }) => (
            <section key={id} id={id} className={`scroll-mt-44 rounded-[28px] p-6 md:p-8 ${tone}`}>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${icon} shadow-[0_3px_0_rgb(0_0_0/0.15)]`}>
                <Icon size={22} />
              </span>
              <h2 className="mt-4 text-[26px] text-ink">{title}</h2>
              <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
                {items.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="mt-[8px] h-2 w-2 shrink-0 rounded-[3px] bg-plum/50" />
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section id="store" className="mt-6 grid scroll-mt-44 gap-6 rounded-[30px] bg-plum p-6 text-white md:grid-cols-[1.4fr_1fr] md:p-10" aria-labelledby="store-h">
          <div>
            <p className="eyebrow text-plum">Дэлгүүр дээр ирээд үзээрэй</p>
            <h2 id="store-h" className="mt-3 text-[30px] md:text-[42px]">
              {business.store.name}
            </h2>
            <p className="mt-3 flex items-start gap-2 text-white/85">
              <PinIcon size={18} className="mt-1 shrink-0 text-sun" /> {business.store.address}
            </p>
            <a href={`tel:${business.phone.tel}`} className="btn btn-sun mt-7">
              <PhoneIcon size={17} /> {business.phone.display}
            </a>
          </div>
          <div className="grid content-center gap-3">
            {[
              { href: business.facebook, Icon: FacebookIcon, v: `${business.alias} · ${business.followers}` },
              { href: business.instagram, Icon: InstagramIcon, v: business.instagramHandle },
              { href: `mailto:${business.email}`, Icon: MailIcon, v: business.email },
            ].map(({ href, Icon, v }) => (
              <a key={v} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex min-w-0 items-center gap-3 rounded-[18px] bg-white/10 p-4 ring-2 ring-white/10 hover:bg-white/15">
                <Icon size={20} className="shrink-0 text-sun" />
                <b className="truncate font-semibold">{v}</b>
              </a>
            ))}
          </div>
        </section>

        <section className="card mt-6 p-6 md:p-8" aria-labelledby="flow">
          <h2 id="flow" className="text-[26px] text-ink">
            Захиалгын <span className="script text-leaf">явц</span>
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ORDER_STATUSES.map((s, i) => (
              <li key={s.id} className="flex gap-3">
                <span className="display grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-plum text-[15px] font-bold text-sun shadow-[0_3px_0_#2a0d2e]">{i + 1}</span>
                <span>
                  <b className="display block font-semibold">{s.name}</b>
                  <span className="text-[14px] text-ink-2">{s.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section id="faq" className="mt-6 scroll-mt-44" aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-[30px] text-ink md:text-[40px]">
            Түгээмэл <span className="script text-sky">асуулт</span>
          </h2>
          <div className="mt-5 grid gap-3">
            {faq.map((x) => (
              <details key={x.q} className="group card p-5 md:p-6">
                <summary className="display flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                  {x.q}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sun text-[20px] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] whitespace-pre-line text-ink-2">{x.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
