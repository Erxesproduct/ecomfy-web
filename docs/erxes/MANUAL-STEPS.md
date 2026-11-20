# eComfy store (Comfy kids): erxes manual steps

Owner of every step below: **Terbish**, with the shop for credentials and decisions.

These steps happen in the erxes 3.0 admin (and at QPay / ebarimt.mn), not in code. The website reads the results
through the environment variables in `.env.example`. Never commit their values; set them in
**Vercel → ecomfy-web → Settings → Environment Variables** and redeploy.

There is no erxes instance for this shop yet ("erxes 3.0: NOT SET"). Create the workspace first.

> **Security warning.** The public Zochil shop API for ecomfy.mn returns the shop's **Pocket client id / client
> secret / terminal id / invoice type** and a **Facebook page token** (with its expiry) to anyone who opens the site.
> They were removed from the scraped data, never copied into this repository and never used. Ask the shop to
> **rotate the Pocket credentials** (Pocket merchant portal) and the **Facebook page token**, and ask Zochil to stop
> exposing them.

| Task | Website | erxes / external (manual) |
| --- | --- | --- |
| [1.1] Products, categories, prices | done: 430 products, 696 variants, 6 groups, 29 shelves, 4 age groups, 9 skills, MNT prices, 1,061 photos | import the CSVs (1.1) |
| [1.2] QPay | done: QPay invoice + status check through the erxes payment plugin | **blocked**: QPay merchant credentials, erxes payment method (1.2) |
| [1.3] eBarimt | done: person / company choice, registry number validated | **blocked**: PosAPI registration, TIN; receipts are issued by erxes (1.3) |
| [1.4] Delivery, fees, statuses | done: A-Б zone 8,000₮, free over 200,000₮, 24 h, 12 h exchange, cancel fee, status list | delivery products, pipeline stages; **confirm the 10,000₮ zone** (1.4) |
| [1.5] Full journey test | validation verified (`npm run test:order`, 30 checks) | **blocked**: a real order needs the env vars and 1.2 / 1.3 (1.5) |

---

## 1.1 Products, categories, prices

Source: ecomfy.mn (Zochil shop 24907), read 2026-11-20: **430 enabled products**, **696 variants** (114 products have
sizes, colours or types), MNT prices 1,500₮–1,350,000₮, up to 6 photos per product, the shop's logo and banner, two
advice posts, FAQ, about text. Facebook page: Comfy kids store (18,700+ followers).

- Groups follow what the shop sells: **Монтессори** (130), **Тоглоом** (111), **Сургууль, бичиг хэрэг** (78),
  **Хичээлийн ширээ, сандал** (13), **Kawaii** (18), **Бэлэг** (80). They come from the shop's own Zochil categories
  (a product in several is put in the most specific one), shelves from its sub-categories, then from the product name.
- **Age** (0–1, 1–3, 3–5, 6+) comes only from the shop's own age categories. **Skills** (үсэг тоо, сэтгэхүй, гарын
  булчин…) come from the shop's Montessori sub-categories and the product name. Nothing is guessed beyond that.
- «Захиалгаар» (made to order, the shop's category, 4 products, desks): orderable, shown with a note.
- Sale prices: 3 products have a Zochil «before» price.
- Stock: Zochil counts stock per product (variants share it); 625 variants have a count, 62 are at 0 (shown sold out).
- Old Zochil URLs (`/products/<category>/<id>`, categories, `/about`, `/faq`, posts…) redirect to the new pages.

Steps:

1. Run `npm run export:erxes` (already run; files in `docs/erxes/`).
2. **Products & Services → Categories → Import**: `ecomfy-categories.csv` (EC → groups → shelves → EC-DELIVERY).
3. **Products & Services → Import**: `ecomfy-products.csv`. One row per variant, code `EC-<productId>` or
   `EC-<productId>-<variantId>` (the same id the website sends with every order line), unit price and price before
   sale in MNT, ages, skills, made-to-order flag.
4. Spot-check 10 products (price, size) against ecomfy.mn.

## 1.2 Payment (QPay)

Zochil rule, word for word: «Та төлбөрөө 100% төлснөөр таны захиалга баталгаажна.» Zochil has QPay (qpay2, Khan) on, but
its checkout status is not enabled. The website:

- records the order in erxes first, then creates a QPay invoice with the erxes payment plugin (`generateInvoiceUrl`,
  public). The customer pays on the erxes payment page and returns to `/order/<reference>`, which asks `invoicesCheck`
  every 5 s.
- never asks for money for an order staff cannot see. Pocket is not offered (its exposed credentials must be rotated
  first, and it is not part of this brief).

Steps:

1. Get the shop's own QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`) (open question 3).
2. **Settings → Payments → Add → QPay (v2)**: enter them. Make a 100₮ test invoice in erxes.
3. Copy the payment method's `_id` into Vercel as `ERXES_PAYMENT_IDS`.
4. **Not yet tested** against a real QPay merchant. Do not call payments working until step 2 and 1.5 pass.

## 1.3 eBarimt

The website never makes a receipt. The checkout asks «Хувь хүн» or «Байгууллага» (7-digit registry number, checked on
the server) and writes it on the order. The receipt is issued in erxes by staff after payment.

1. Collect from the shop: company or person name and TIN, district code, VAT status, product classification codes
   (toys, books, stationery, furniture, tableware).
2. Register for **PosAPI 3.0** (ebarimt.mn) and install the PosAPI service.
3. **Settings → eBarimt**: PosAPI URL, TIN, district code, VAT switches; assign it to the website pipeline.
4. For every paid order: issue the receipt once (goods + delivery fee) and send the lottery number.

## 1.4 Delivery zones, fees and order statuses

Website (done), from the Zochil delivery option, payment rule, delivery rule and terms:

| Zochil | Website |
| --- | --- |
| Option «A-Б бүс», **8,000₮**, limit 200,000₮; area: north 7 буудал, west 5 шар, east Оффицерийн тойрог, south Зайсан | 8,000₮; **free when the goods come to more than 200,000₮** (exactly 200,000₮ still pays: «дээш»); area shown at checkout and on /info |
| Payment rule: «Хүргэлт бүсээс хамааран **8,000₮–10,000₮**» | the 10,000₮ zone has no Zochil option: not offered online; outside A-Б the site asks to call 8878-8757 first (open question 1) |
| Delivery rule: within 24 h of confirmation; cancelled at the door → the customer pays the delivery fee | shown at checkout, on /info and in the order note; agreed at checkout |
| Terms: exchange within 12 h at the store, unopened and unused | required checkbox at checkout; /info; product page |
| Countryside switch on, no option or fee | not offered online; call first (open question 2) |

erxes:

1. Import `docs/erxes/ecomfy-delivery.csv`: `EC-DELIVERY-AB` 8,000₮ and `EC-DELIVERY-FAR` 10,000₮ (**confirm the
   area before using the second**).
2. **Sales → Boards → «Онлайн захиалга» → pipeline «Вэбсайт»**, stages (as on the website):
   Төлбөр хүлээгдэж байна → Баталгаажсан → Бэлдэж байна → Хүргэлтэд гарсан → Хүргэгдсэн, plus Цуцлагдсан.
3. **Frontline → Forms → (order form) → Settings**: create a sales card in «Төлбөр хүлээгдэж байна» for every
   submission. Staff move it to «Баталгаажсан» when the QPay invoice shows paid.
4. Made-to-order products (desks): add the lead time to the card when confirming by phone (open question 5).
