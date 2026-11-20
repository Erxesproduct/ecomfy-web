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
