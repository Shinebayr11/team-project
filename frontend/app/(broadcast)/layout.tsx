import { AppShell } from "@/components/layout/AppShell"

/**
 * The LiveKit surface (/sell, /live/[id]) shares the storefront chrome so going
 * live is part of the same app rather than a detached page.
 */
export default function BroadcastLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
