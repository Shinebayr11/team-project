const API_URL = process.env.NEXT_PUBLIC_API_URL

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

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const body = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(res.status, body?.message ?? "Хүсэлт амжилтгүй боллоо", body)
  }

  return body as T
}
