import type { Metadata, Viewport } from "next"
import {
  Bricolage_Grotesque,
  Geist_Mono,
  Inter,
  Plus_Jakarta_Sans,
} from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

import "./globals.css"
import { cn } from "@/lib/utils"
import { UserSync } from "@/components/auth/UserSync"
import { NamePrompt } from "@/components/auth/NamePrompt"

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

/**
 * The WhyNot UI draws itself with Plus Jakarta Sans / Bricolage Grotesque
 * (--wn-font, --wn-font-display in globals.css). Those used to come from an
 * `@import url("https://fonts.googleapis.com/...")` at the top of globals.css,
 * which Tailwind v4's own `@import "tailwindcss"` swallowed — the request was
 * never made in dev or in a production build, so every surface silently fell
 * back to system-ui. Loading them here self-hosts the files and keeps the
 * third-party round trip off the critical path.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
})

export const metadata: Metadata = {
  title: "WhyNot",
  description: "Шууд дамжуулалттай дуудлага худалдаа",
}

/**
 * Next-ийн анхны утга нь `width=device-width, initial-scale=1` — тэр нь байсан.
 * Дутуу байсан нь `viewportFit: "cover"`: үүнгүйгээр `env(safe-area-inset-*)`
 * бүр 0 болж уншигддаг тул `components/ui/sheet.tsx`-ийн доод талын аюулгүй
 * бүсийн тооцоо notch-той төхөөрөмж дээр огт ажиллахгүй байв.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
          inter.variable,
          jakarta.variable,
          bricolage.variable
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
