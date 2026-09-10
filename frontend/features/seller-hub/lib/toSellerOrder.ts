import { DirectOrder, orderBuyer, orderBuyerName, orderProduct } from "@/hooks/useMySellerOrders"
import { SellerOrder } from "@/features/seller-hub/types"

/**
 * Бодит `Order`-г (`useMySellerOrders`) хуучин mock `SellerOrder` хэлбэрт
 * буулгана — `OrdersTable`/`OrderDetail`/`FulfillmentPanel` гэх мэт бүх
 * захиалгын UI зөвхөн энэ л төрлийг мэддэг тул шинэ компонент зохиохгүйгээр
 * дахин ашиглаж болно.
 */
export const toSellerOrder = (order: DirectOrder): SellerOrder => {
  const product = orderProduct(order)
  const buyer = orderBuyer(order)
  const address = order.shipping_address

  return {
    // Mongo-гийн `_id` урт тул сүүлийн 6 тэмдэгтээр богиносгож, mock-ийн
    // "#1041" маягтай ойролцоо харагдана.
    id: `#${order._id.slice(-6).toUpperCase()}`,
    buyerName: orderBuyerName(buyer),
    buyerPhone: address?.phone,
    date: order.createdAt ?? order.updatedAt ?? new Date().toISOString(),
    total: order.price_coins ?? 0,
    paymentStatus: "PAID",
    fulfillmentStatus: order.fulfillment_status ?? "PENDING",
    items: [
      {
        productId: product?._id ?? "",
        name: product?.name ?? "Бараа",
        sku: "",
        price: product?.price_coins ?? 0,
        qty: order.quantity,
      },
    ],
    // Бодит хаяг Монгол загвартай (хот/дүүрэг/хороо/дэлгэрэнгүй) — mock
    // төрөл нь АНУ-ын загвартай (addressLine1/state/postalCode) тул
    // хамгийн ойролцоо талбарууд руу буулгана.
    shippingAddress: address
      ? {
          fullName: address.fullName,
          addressLine1: address.detail,
          city: address.city,
          state: address.district,
          postalCode: address.khoroo ?? "",
          country: "Монгол улс",
        }
      : {
          fullName: orderBuyerName(buyer),
          addressLine1: "Хаяг бүртгэгдээгүй",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
    trackingNumber: order.tracking_number,
    carrier: order.carrier,
  }
}
