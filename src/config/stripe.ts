// Stripe Payment Links Configuration
// All links now support promotion codes (WELCOME10, etc.)
export const STRIPE_PAYMENT_LINKS = {
  GATHERED_GRACE_GIFT_BOX: "https://buy.stripe.com/5kQ6oH45z9JUcba7TS1RC0n",
  LAVENDER_EYE_PILLOW: "https://buy.stripe.com/4gM3cvgSl5tE7UU4HG1RC0m",
  LAVENDER_EYE_PILLOW_CUSTOM_FABRIC: "https://buy.stripe.com/cNi28r59D1dogrq4HG1RC0o",
  HANDMADE_BALM: "https://buy.stripe.com/cNi8wPdG9aNYejica81RC0l",
  JOURNAL_PEN_SET: "https://buy.stripe.com/28EcN5cC58FQ0ssb641RC0k",
  REST_KIT: "https://buy.stripe.com/bJecN57hL09k5MMgqo1RC0j",
  REST_KIT_CUSTOM_FABRIC: "https://buy.stripe.com/4gMaEX31v09k4II4HG1RC0i",
  REFLECT_KIT: "https://buy.stripe.com/bJe3cv0Tn9JU5MM4HG1RC0h",
  REFLECT_KIT_CUSTOM_FABRIC: "https://buy.stripe.com/6oU3cv9pTe0a5MMdec1RC0g",
  RESTORE_KIT: "https://buy.stripe.com/cNi3cv59D5tEfnmca81RC0f",
  RESTORE_KIT_CUSTOM_FABRIC: "https://buy.stripe.com/14AeVd8lP09k8YYa201RC0e",
  GATHERED_GRACE_GIFT_BOX_CUSTOM_FABRIC: "https://buy.stripe.com/5kQ6oH45z9JUcba7TS1RC0n", // Using same link as main gift box
} as const;

// Product information
export const STRIPE_PRODUCTS = {
  GATHERED_GRACE_GIFT_BOX: {
    id: "prod_TO8ehbWbpIi9Ta",
    priceId: "price_1SRMNWHB58d6ZKt6daFowSKq",
    name: "Gathered Grace Gift Box",
    price: "$68",
    paymentLink: STRIPE_PAYMENT_LINKS.GATHERED_GRACE_GIFT_BOX,
    customFabricPaymentLink: STRIPE_PAYMENT_LINKS.GATHERED_GRACE_GIFT_BOX_CUSTOM_FABRIC,
    customFabricPrice: "$73",
  },
  LAVENDER_EYE_PILLOW: {
    id: "prod_TO8fwbcrLqIREu",
    priceId: "price_1SRMNuHB58d6ZKt6FqSnIjnr",
    name: "Handmade Lavender Eye Pillow",
    price: "$22",
    paymentLink: STRIPE_PAYMENT_LINKS.LAVENDER_EYE_PILLOW,
    customFabricPaymentLink: STRIPE_PAYMENT_LINKS.LAVENDER_EYE_PILLOW_CUSTOM_FABRIC,
    customFabricPrice: "$27",
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
    id: "prod_TWljxcgNFJri5F",
    priceId: "price_1SZiCXHB58d6ZKt63Ph7IsD0",
    customFabricPriceId: "price_1SZiCYHB58d6ZKt6o7NeY5wm",
    name: "Rest Kit",
    price: "$39",
    paymentLink: STRIPE_PAYMENT_LINKS.REST_KIT,
    customFabricPaymentLink: STRIPE_PAYMENT_LINKS.REST_KIT_CUSTOM_FABRIC,
    customFabricPrice: "$44",
  },
  REFLECT_KIT: {
    id: "prod_TWljzZXxkgXNrs",
    priceId: "price_1SZiCaHB58d6ZKt6PGMy0pVU",
    customFabricPriceId: "price_1SZiCbHB58d6ZKt6zRMacHb2",
    name: "Reflect Kit",
    price: "$49",
    paymentLink: STRIPE_PAYMENT_LINKS.REFLECT_KIT,
    customFabricPaymentLink: STRIPE_PAYMENT_LINKS.REFLECT_KIT_CUSTOM_FABRIC,
    customFabricPrice: "$54",
  },
  RESTORE_KIT: {
    id: "prod_TWmDQMnaEaYuMb",
    priceId: "price_1SZieyHB58d6ZKt6v4qMDKpF",
    customFabricPriceId: "price_1SZif0HB58d6ZKt6XXzQFZeW",
    name: "Restore Kit",
    price: "$69",
    paymentLink: STRIPE_PAYMENT_LINKS.RESTORE_KIT,
    customFabricPaymentLink: STRIPE_PAYMENT_LINKS.RESTORE_KIT_CUSTOM_FABRIC,
    customFabricPrice: "$74",
  },
} as const;

