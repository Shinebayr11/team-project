import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

import "./globals.css"
import { cn } from "@/lib/utils"
import { UserSync } from "@/components/auth/UserSync"
import { NamePrompt } from "@/components/auth/NamePrompt"

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "WhyNot",
  description: "Шууд дамжуулалттай дуудлага худалдаа",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="mn"
        suppressHydrationWarning
        className={cn(
          "antialiased",
          fontMono.variable,
          "font-sans",
          inter.variable
        )}
      >
        <body suppressHydrationWarning>
          <UserSync />
          <NamePrompt />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
