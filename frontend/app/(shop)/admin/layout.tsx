import { SellerHubLayout } from "@/features/seller-hub"

export default function SellerHubRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SellerHubLayout>{children}</SellerHubLayout>
}
