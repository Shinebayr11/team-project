/**
 * Бүх хүсэлт ХӨТӨЧИЙН ижил домэйн руу явна: `/api/*`-ыг `next.config.ts` дэх
 * rewrite backend рүү дамжуулна.
 *
 * Өмнө нь энд `NEXT_PUBLIC_API_URL`-ыг угтвар болгодог байсан тул (1) rewrite
 * хэзээ ч ажилладаггүй үхмэл тохиргоо болж, (2) орчны хувьсагч дутуу үед
 * `undefined/api/...` рүү хүсэлт явж чимээгүй уначихдаг байв. Backend-ийн
 * хаяг одоо ганц газар — `next.config.ts` дотор л бичигдэнэ.
 */

export class ApiError extends Error {
  status: number
  /**
   * Серверийн буцаасан бүтэн бие. Талбар тус бүрийн алдааг (жишээ нь
   * `{ fields: { storeSlug: "..." } }`) input-ийн доор харуулахад хэрэгтэй —
   * зөвхөн `message` үлдээвэл тэр мэдээлэл алдагдана.
   */
  body: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(path, { ...options, headers })
  const body = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(res.status, body?.message ?? "Хүсэлт амжилтгүй боллоо", body)
  }

  return body as T
}
