import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect("/home")

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-16 items-center justify-between px-6">
        <span className="text-xl font-bold tracking-tight">Reelshop</span>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Шууд дамжуулалттай дуудлага худалдаа
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Ховор эд зүйлс, винтаж олдворууд шууд дамжуулалтаар
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/sign-up?intent=buyer"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Худалдан авах эхлэх
          </Link>
          <Link
            href="/sell"
            className="inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium hover:bg-accent"
          >
            Худалдагч болох
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          Бүртгэлтэй юу?
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline"
          >
            Нэвтрэх
          </Link>
        </p>
      </main>
    </div>
  )
}
