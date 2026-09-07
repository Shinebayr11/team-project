"use client"

import * as React from "react"
import { useSession, useUser } from "@clerk/nextjs"

import { Field } from "@/features/seller-hub/components/FormField"

const PASSWORD_MIN = 8
const SAVED_HOLD_MS = 1800

// `@clerk/types` тусад нь суулгагдаагүй тул сешний төрлийг Clerk-ийн өөрийнх нь
// API-аас гаргаж авна.
type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>
type UserSession = Awaited<ReturnType<ClerkUser["getSessions"]>>[number]

const control =
  "w-full h-10 rounded-lg border border-[var(--wn-ink-4)] px-3 text-[14px] font-[500] text-black outline-none focus:border-black"

/** Clerk-ийн алдаанууд `errors[].longMessage` дотор ирдэг. */
const clerkMessage = (error: unknown): string => {
  const errors = (error as { errors?: { longMessage?: string; message?: string }[] })?.errors
  return errors?.[0]?.longMessage ?? errors?.[0]?.message ?? "Алдаа гарлаа. Дахин оролдоно уу."
}

const sessionLabel = (session: UserSession): string => {
  const activity = session.latestActivity
  const device = activity?.deviceType ?? (activity?.isMobile ? "Гар утас" : "Компьютер")
  const browser = activity?.browserName
  const place = [activity?.city, activity?.country].filter(Boolean).join(", ")
  return [device, browser, place].filter(Boolean).join(" · ")
}

/**
 * Аюулгүй байдал. Нэвтрэлтийг Clerk бүрэн хариуцдаг тул нууц үг, идэвхтэй
 * сешнүүд ЗӨВХӨН Clerk-ийн API-аар өөрчлөгдөнө — Mongo-д нууц үгийн талбар
 * огт байхгүй.
 */
export const SecurityPanel: React.FC = () => {
  const { user } = useUser()
  const { session } = useSession()

  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [phase, setPhase] = React.useState<"idle" | "saving" | "saved">("idle")
  const [error, setError] = React.useState<string | null>(null)

  const [sessions, setSessions] = React.useState<UserSession[] | null>(null)
  const [revoking, setRevoking] = React.useState(false)

  const holdTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
  }, [])

  const loadSessions = React.useCallback(async () => {
    if (!user) return
    try {
      setSessions(await user.getSessions())
    } catch (loadError) {
      console.error("Сешн уншиж чадсангүй:", loadError)
      setSessions([])
    }
  }, [user])

  React.useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  if (!user) return null

  const hasPassword = user.passwordEnabled
  const passwordLongEnough = newPassword.length >= PASSWORD_MIN
  const passwordsMatch = newPassword === confirmPassword
  const canSubmit =
    phase !== "saving" &&
    passwordLongEnough &&
    passwordsMatch &&
    (!hasPassword || currentPassword.length > 0)

  const submitPassword = async () => {
    if (!canSubmit) return
    setPhase("saving")
    setError(null)

    try {
      await user.updatePassword({
        newPassword,
        ...(hasPassword ? { currentPassword } : {}),
        signOutOfOtherSessions: true,
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPhase("saved")
      holdTimer.current = setTimeout(() => setPhase("idle"), SAVED_HOLD_MS)
      void loadSessions()
    } catch (updateError) {
      setPhase("idle")
      setError(clerkMessage(updateError))
    }
  }

  const otherSessions = (sessions ?? []).filter((row) => row.id !== session?.id)

  const revokeOthers = async () => {
    setRevoking(true)
    try {
      await Promise.all(otherSessions.map((row) => row.revoke()))
      await loadSessions()
    } catch (revokeError) {
      setError(clerkMessage(revokeError))
    } finally {
      setRevoking(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] mb-1 text-black">Аюулгүй байдал</h2>
        <p className="text-[14px] text-gray-500 font-[500]">
          Нууц үг, нэвтэрсэн төхөөрөмжүүдээ эндээс удирдана.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-[16px] font-[800] text-black">
              {hasPassword ? "Нууц үг солих" : "Нууц үг үүсгэх"}
            </h3>
            <p className="mt-0.5 text-[12.5px] text-gray-500">
              {hasPassword
                ? "Шинэ нууц үг тавьснаар бусад төхөөрөмжөөс автоматаар гарна."
                : "Та одоогоор нууц үггүй (утасны код эсвэл Google зэрэг гадаад бүртгэлээр) нэвтэрдэг. Нууц үг тавьбал нэмэлт нэвтрэх арга нээгдэнэ."}
            </p>
          </div>

          {hasPassword && (
            <Field label="Одоогийн нууц үг">
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value)
                  setError(null)
                }}
                autoComplete="current-password"
                disabled={phase === "saving"}
                className={control}
              />
            </Field>
          )}

          <div>
            <Field label="Шинэ нууц үг">
              <input
                type="password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value)
                  setError(null)
                }}
                autoComplete="new-password"
                disabled={phase === "saving"}
                className={control}
              />
            </Field>
            <p className="mt-1 text-[12.5px] text-gray-500">
              {PASSWORD_MIN}-аас доошгүй тэмдэгт.
            </p>
          </div>

          <div>
            <Field label="Шинэ нууц үг давтах">
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  setError(null)
                }}
                autoComplete="new-password"
                disabled={phase === "saving"}
                className={control}
              />
            </Field>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-1 text-[12.5px] font-[600] text-red-600">
                Хоёр нууц үг таарахгүй байна.
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-3.5 py-2.5">
              <p className="text-[13px] font-[600] text-red-600">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={submitPassword}
              disabled={!canSubmit}
              className="h-10 rounded-lg bg-black px-5 text-[14px] font-[700] text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {phase === "saving" ? "Хадгалж байна…" : "Нууц үг хадгалах"}
            </button>
            {phase === "saved" && (
              <span className="text-[13px] font-[700] text-emerald-600">Шинэчлэгдлээ</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[16px] font-[800] text-black">Хоёр шатлалт баталгаажуулалт</h3>
            <span
              className={`rounded-md px-2.5 py-1 text-[11px] font-[800] tracking-wider uppercase ${
                user.twoFactorEnabled
                  ? "bg-[#E6F4EA] text-[#166534]"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {user.twoFactorEnabled ? "Идэвхтэй" : "Идэвхгүй"}
            </span>
          </div>
          <p className="text-[13px] text-gray-500">
            {user.twoFactorEnabled
              ? "Нэвтрэх бүрд нэг удаагийн код шаардана."
              : "Нэмэлт хамгаалалт болгож нэг удаагийн кодын аппликейшн холбож болно."}
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[16px] font-[800] text-black">Нэвтэрсэн төхөөрөмжүүд</h3>
            {otherSessions.length > 0 && (
              <button
                type="button"
                onClick={revokeOthers}
                disabled={revoking}
                className="text-[13px] font-[800] text-red-600 underline underline-offset-2 disabled:opacity-60"
              >
                {revoking ? "Гаргаж байна…" : "Бусад бүрээс гарах"}
              </button>
            )}
          </div>

          {sessions === null ? (
            <p className="text-[13px] text-gray-500">Уншиж байна...</p>
          ) : (
            <div className="flex flex-col gap-3">
              {sessions.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                >
                  <div>
                    <div className="text-[14px] font-[600] text-black">{sessionLabel(row)}</div>
                    <div className="mt-0.5 text-[12.5px] text-gray-500">
                      Сүүлд идэвхтэй: {new Date(row.lastActiveAt).toLocaleString()}
                    </div>
                  </div>
                  {row.id === session?.id && (
                    <span className="rounded-md bg-[#E6F4EA] px-2.5 py-1 text-[11px] font-[800] tracking-wider text-[#166534] uppercase">
                      Энэ төхөөрөмж
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
