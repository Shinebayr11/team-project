import { SignUp } from "@clerk/nextjs"

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>
}) {
  const { intent } = await searchParams
  const redirectUrl = intent === "seller" ? "/sell/onboarding" : "/home"

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <SignUp fallbackRedirectUrl={redirectUrl} />
    </div>
  )
}
