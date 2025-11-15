// Stripe Payment Links Configuration
export const STRIPE_PAYMENT_LINKS = {
  GATHERED_GRACE_GIFT_BOX: "https://buy.stripe.com/4gMfZhgSl6xIeji1vu1RC00",
  LAVENDER_EYE_PILLOW: "https://buy.stripe.com/28EdR9gSl5tEcba3DC1RC01",
  HANDMADE_BALM: "https://buy.stripe.com/00wcN5dG93lwcba0rq1RC02",
  JOURNAL_PEN_SET: "https://buy.stripe.com/5kQdR9eKd7BMdfeb641RC03",
  REST_KIT: "https://buy.stripe.com/placeholder-rest-kit",
  REFLECT_KIT: "https://buy.stripe.com/placeholder-reflect-kit",
} as const;

// Product information
export const STRIPE_PRODUCTS = {
  GATHERED_GRACE_GIFT_BOX: {
    id: "prod_TO8ehbWbpIi9Ta",
    priceId: "price_1SRMNWHB58d6ZKt6daFowSKq",
    name: "Gathered Grace Gift Box",
    price: "$68",
    paymentLink: STRIPE_PAYMENT_LINKS.GATHERED_GRACE_GIFT_BOX,
  },
  LAVENDER_EYE_PILLOW: {
    id: "prod_TO8fwbcrLqIREu",
    priceId: "price_1SRMNuHB58d6ZKt6FqSnIjnr",
    name: "Handmade Lavender Eye Pillow",
    price: "$22",
    paymentLink: STRIPE_PAYMENT_LINKS.LAVENDER_EYE_PILLOW,
  },
  HANDMADE_BALM: {
    id: "prod_TO8faz5COGN3sQ",
    priceId: "price_1SRMO9HB58d6ZKt6NPQRCIW9",
    name: "Handmade Balm",
    price: "$15",
    paymentLink: STRIPE_PAYMENT_LINKS.HANDMADE_BALM,
  },
  JOURNAL_PEN_SET: {
    id: "prod_TO8fB5cUYaPNx9",
    priceId: "price_1SRMONHB58d6ZKt6wQpUzuTd",
    name: "Journal and Pen Set",
    price: "$18",
    paymentLink: STRIPE_PAYMENT_LINKS.JOURNAL_PEN_SET,
  },
  REST_KIT: {
    id: "prod_rest_kit",
    priceId: "price_rest_kit",
    name: "Rest Kit",
    price: "$39",
    paymentLink: STRIPE_PAYMENT_LINKS.REST_KIT,
  },
  REFLECT_KIT: {
    id: "prod_reflect_kit",
    priceId: "price_reflect_kit",
    name: "Reflect Kit",
    price: "$49",
    paymentLink: STRIPE_PAYMENT_LINKS.REFLECT_KIT,
  },
} as const;

