import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  /**
   * Backend-ийн хаяг бүх аппад ГАНЦ УДАА энд бичигдэнэ. Клиент нь зөвхөн
   * `/api/...` гэж дууддаг (`lib/api.ts`) тул хөтөч дээр орчны хувьсагч
   * шаардлагагүй бөгөөд cross-origin ч болохгүй.
   *
   * `API_URL` тохируулаагүй бол локал сервер рүү (3001) заана — production
   * дээр заавал тохируулна.
   */
  rewrites: async () => ({
    beforeFiles: [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/:path*`,
      },
    ],
  }),
}

export default nextConfig
