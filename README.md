# eComfy store (Comfy kids) web store

Next.js 16 storefront that replaces the Zochil shop at ecomfy.mn: Montessori toys, toys, books and stationery,
ergonomic study desks and chairs, kawaii goods and gift sets, from the eComfy kids concept store in Ulaanbaatar.

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (no erxes needed)
npm run export:erxes   # docs/erxes/ecomfy-*.csv for the erxes product import
```

- Catalog: `src/data/catalog.json` (+ `lite.json` for the cart and search), built from Zochil shop 24907 on 2026-11-20.
  Photos in `public/img/<hash>.webp`, the shop's logo, banner and post images in `public/brand/`.
- Business rules (A-Б zone 8,000₮, free over 200,000₮, 24 h, QPay 100% before confirmation, 12 h exchange, cancel fee
  at the door, made-to-order desks, FAQ, the shop's two advice posts): `src/content/business.ts`.
- Orders go to erxes (form submission → Sales card), QPay through the erxes payment plugin. Until the `ERXES_*`
  variables (`.env.example`) are set, `/api/orders` answers `503 not_configured` and the checkout shows the phone.
- Manual erxes steps and open questions: `docs/erxes/MANUAL-STEPS.md`.

Look «Тоглоомын хайрцаг» (toy box): the plum of the shop's logo and the violet → blue → teal starry sky of its banner,
one bright colour per group (leaf Montessori, tomato toys, sky school, teal desks, bubble kawaii, sun gifts) and per
age, chunky Rubik headlines with one Pacifico word (both have Ө/Ү), Golos Text body. Hero: bestseller photos floating
in coloured rings around a smiling sun, the logo sticker and a wooden train rolling along the track. Pages: home (age
blocks, skills, groups, bestsellers, Montessori, desk advice, screen-time guide, gifts, store), shop (group, shelf,
age, skill, in stock, sale, search, sort, pages), product (ages, skills, made-to-order note, low stock), instant
search, cart / checkout, order status, saved items, info (delivery, payment, exchange, store, order flow, FAQ).
