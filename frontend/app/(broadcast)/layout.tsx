import { AppShell } from "@/components/layout/AppShell"

/**
 * The LiveKit surface (/sell, /live/[id]) shares the storefront chrome so going
 * live is part of the same app rather than a detached page. Auth is enforced
 * per-page here, not at this layout level, because /live/[id] must stay
 * watchable signed-out — only starting a show (/sell) or joining as host
 * requires a session.
 */
export default function BroadcastLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
