import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { Logo, Star, Train } from "./brand";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TruckIcon } from "./icons";

export function Footer() {
  const cards = [
    { href: `tel:${business.phone.tel}`, Icon: PhoneIcon, k: "Утас", v: business.phone.display, tone: "bg-sun text-ink" },
    { href: business.facebook, Icon: FacebookIcon, k: `Facebook · ${business.followers}`, v: business.alias, tone: "bg-sky text-white" },
    { href: business.instagram, Icon: InstagramIcon, k: "Instagram", v: business.instagramHandle, tone: "bg-bubble text-white" },
    { href: `mailto:${business.email}`, Icon: MailIcon, k: "Имэйл", v: business.email, tone: "bg-leaf text-white" },
  ];
  return (
    <footer id="contact" className="sky stars relative mt-24 overflow-hidden pb-28 text-white md:pb-0">
      <Train className="choo pointer-events-none absolute top-3 left-0 w-[180px] opacity-90 md:w-[220px]" />
      <div className="wrap relative pt-24 pb-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <Logo light />
            <p className="display mt-6 max-w-md text-[28px] leading-tight font-extrabold tracking-tight">
              Хүүхэд тань тоглоод <span className="script text-sun">сурна</span>
            </p>
            <p className="mt-3 max-w-md text-[15px] text-white/80">{`${business.since} оноос хойш: тав тухтай, хэрэгцээнд нийцсэн, чанартай бараа боломжийн үнээр.`}</p>
            <div className="mt-6 grid gap-3 text-[14.5px] text-white/85">
              <p className="flex items-start gap-3">
                <TruckIcon size={19} className="mt-0.5 shrink-0 text-sun" />
                {business.zone.name}: {formatPrice(business.zone.price)}, 24 цагт. {formatPrice(business.zone.freeOver)}-өөс дээш үнэгүй.
              </p>
              <p className="flex items-start gap-3">
                <PinIcon size={19} className="mt-0.5 shrink-0 text-sun" />
                {business.store.name}: {business.store.address}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 self-start sm:grid-cols-2">
            {cards.map(({ href, Icon, k, v, tone }) => (
              <a key={k} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-[22px] bg-white/12 p-4 ring-2 ring-white/15 backdrop-blur transition hover:-translate-y-1 hover:bg-white/18">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone} shadow-[0_3px_0_rgb(0_0_0/0.2)] transition group-hover:rotate-[-6deg]`}>
                  <Icon size={21} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] text-white/65">{k}</span>
                  <b className="display block truncate text-[16px] font-semibold">{v}</b>
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-[14px] text-white/75">
          <Link href="/shop" className="hover:text-white">
            Бүх бараа
          </Link>
          <Link href="/#ages" className="hover:text-white">
            Насаар сонгох
          </Link>
          <Link href="/info" className="hover:text-white">
            Хүргэлт, төлбөр, солих
          </Link>
          <Link href="/info#faq" className="hover:text-white">
            Түгээмэл асуулт
          </Link>
          <span className="ml-auto flex items-center gap-2 text-white/60">
            <Star className="h-4 w-4 text-sun" /> © {new Date().getFullYear()} {business.title}
          </span>
        </div>
      </div>
    </footer>
  );
}
