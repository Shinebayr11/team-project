import { SignUp } from "@clerk/nextjs"

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>
}) {
  const { intent } = await searchParams
  // `?intent=seller` — бүртгүүлээд шууд идэвхжүүлэх хуудас нээгдэнэ.
  // Хуучин /sell/onboarding нь "хүсэлт илгээгээд хүлээх" урсгал байсан.
  const redirectUrl = intent === "seller" ? "/home?sellerGate=1" : "/home"

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <SignUp fallbackRedirectUrl={redirectUrl} signInUrl="/sign-in" />
    </div>
  )
}