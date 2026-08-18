import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AppShell } from "@/components/layout/AppShell"

/**
 * The LiveKit surface (/sell, /live/[id]) shares the storefront chrome so going
 * live is part of the same app rather than a detached page.
 */
export default async function BroadcastLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return <AppShell>{children}</AppShell>
}
