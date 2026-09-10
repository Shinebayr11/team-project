import type { Address } from "@/types/account"

/** Хаягийг нэг мөрөнд уншигдахаар нийлүүлнэ. */
export const addressLine = (address: Address) =>
  [address.city, address.district, address.khoroo, address.detail]
    .filter(Boolean)
    .join(", ")
