import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { Logo } from "./brand";
import { CartButton, HeartsButton, MobileMenu, MobileSearch } from "./header-tools";
import { Search } from "./search";

export const NAV = [
  { href: "/shop?g=montessori", label: "Монтессори", dot: "bg-leaf" },
  { href: "/shop?g=toys", label: "Тоглоом", dot: "bg-tomato" },
  { href: "/shop?g=school", label: "Сургууль", dot: "bg-sky" },
  { href: "/shop?g=desk", label: "Ширээ, сандал", dot: "bg-teal" },
  { href: "/shop?g=kawaii", label: "Kawaii", dot: "bg-bubble" },
  { href: "/shop?g=gifts", label: "Бэлэг", dot: "bg-sun" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="sky overflow-hidden text-[12.5px] leading-9 font-medium text-white">
        <div className="wrap flex h-9 items-center justify-center gap-5 sm:justify-between">
          <span className="truncate">
            🚚 24 цагт хүргэнэ · {formatPrice(business.zone.freeOver)}-өөс дээш <b>үнэгүй</b>
          </span>
          <span className="hidden items-center gap-5 sm:flex">
            <span>QPay · И-баримт</span>
            <a href={`tel:${business.phone.tel}`} className="font-semibold hover:underline">
              {business.phone.display}
            </a>
          </span>
        </div>
      </div>
      <div className="border-b-2 border-line bg-cream/92 backdrop-blur-md">
        <div className="wrap flex h-[70px] items-center gap-3 md:h-[78px] md:gap-6">
          <MobileMenu items={NAV} />
          <Link href="/" className="shrink-0" aria-label="eComfy: нүүр хуудас">
            <Logo />
          </Link>
          <Search className="mx-auto hidden w-full max-w-[440px] md:block" />
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <MobileSearch />
            <HeartsButton />
            <CartButton />
          </div>
        </div>
        <nav aria-label="Үндсэн цэс" className="hidden border-t-2 border-line/70 lg:block">
          <div className="wrap flex h-12 items-center gap-1">
            <Link href="/shop" className="display rounded-xl px-3 py-1.5 text-[14.5px] font-semibold hover:bg-paper">
              Бүх бараа
            </Link>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="display flex items-center gap-2 rounded-xl px-3 py-1.5 text-[14.5px] font-medium text-ink-2 transition hover:bg-paper hover:text-ink">
                <span className={`h-2.5 w-2.5 rounded-[4px] ${n.dot}`} aria-hidden />
                {n.label}
              </Link>
            ))}
            <Link href="/#ages" className="display ml-auto rounded-xl px-3 py-1.5 text-[14px] font-semibold text-plum hover:bg-paper">
              Насаар сонгох
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
