import data from "@/data/catalog.json";

/**
 * Business facts from ecomfy.mn (Zochil shop 24907: shop settings, payment and delivery rules, terms of service, the
 * delivery option, FAQ, about page, posts) and the Comfy kids store Facebook page, read on 2026-11-20. Nothing here is
 * invented; where the shop's texts leave a gap (the 10,000₮ zone) it is an open question in docs/erxes/MANUAL-STEPS.md.
 */
const shop = data.shop;
const zone = shop.zone!;

/** The shop's FAQ, word for word. */
export const faq = shop.faq as { q: string; a: string }[];
/** The shop's two posts: desk advice and screen time. */
export const posts = shop.posts as { title: string; lines: string[] }[];

export const business = {
  name: "eComfy",
  /** The Zochil shop name, word for word. */
  title: shop.name,
  /** The Facebook page name and the logo's ring. */
  alias: "Comfy kids store",
  motto: "Kids · Toys · Gifts",
  domain: "ecomfy.mn",
  followers: "18,700+",
  phone: { display: "8878-8757", tel: "+97688788757" },
  email: shop.email,
  facebook: shop.facebook,
  instagram: shop.instagram,
  instagramHandle: "@comfykids.mongolia",
  /** Zochil address + FAQ: the kids concept store. */
  store: { name: "eComfy kids concept store", address: "Баянгол дүүрэг, 24-р хороо, Алтай хотхон 53а байр" },
  since: 2022,

  /** Zochil checkout method: QPay. */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө." }],

  /** The one Zochil delivery option. */
  zone: { name: zone.title, area: zone.description, price: zone.price, freeOver: zone.freeOver },

  rules: {
    /** Zochil payment rule, word for word. */
    payment: shop.paymentRule,
    /** Zochil delivery rule, word for word. */
    delivery: shop.deliveryRule,
    /** Zochil terms of service, word for word. */
    terms: shop.terms,
    time: "Захиалга баталгаажсанаас хойш 24 цагийн дотор хүргэнэ.",
    cancel: "Хүргэлт очсон үед захиалгаа цуцалбал хүргэлтийн төлбөр төлнө.",
    exchange: "Хүлээн авснаас хойш 12 цагийн дотор дэлгүүр дээр авчирч солиулж болно: савлагаа бүтэн, задлаагүй, хэрэглээгүй байх.",
    outside: "A-Б бүсээс гадуур болон орон нутагт хүргүүлэх бол захиалахаасаа өмнө 8878-8757 дугаараар тохирно уу.",
    order: "«Захиалгаар» гэсэн бараа (ширээ, сандал) захиалгаар ирнэ: хугацааг утсаар тохирно.",
    ebarimt: "И-баримтыг төлбөр баталгаажсаны дараа erxes-ээс албан ёсоор олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
  },
} as const;

export type PaymentId = (typeof business.payments)[number]["id"];
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** Zochil rule: the zone fee, free when the goods come to more than the zone's limit (200,000₮). */
export function deliveryFee(subtotal: number): number {
  return business.zone.freeOver > 0 && subtotal > business.zone.freeOver ? 0 : business.zone.price;
}

/** Order statuses staff move an order through (erxes Sales pipeline stages, see MANUAL-STEPS.md). */
export const ORDER_STATUSES = [
  { id: "pending", name: "Төлбөр хүлээгдэж байна", note: "QPay-ээр 100% төлснөөр баталгаажна" },
  { id: "paid", name: "Баталгаажсан", note: "Төлбөр орсон, бараагаа бэлдэж эхэлнэ" },
  { id: "packing", name: "Бэлдэж байна", note: "Савлаж, хүргэлтэд бэлдэнэ" },
  { id: "shipped", name: "Хүргэлтэд гарсан", note: "24 цагийн дотор хүргэнэ" },
  { id: "delivered", name: "Хүргэгдсэн", note: "12 цагийн дотор солиулж болно" },
  { id: "cancelled", name: "Цуцлагдсан", note: "Төлбөр төлөгдөөгүй, эсвэл хүргэлт дээр цуцалсан" },
] as const;
