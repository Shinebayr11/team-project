import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      {/* `fallbackRedirectUrl`-гүй бол Clerk нэвтэрсний дараа анхны утга болох
          "/" рүү буцаадаг — тэр нь marketing landing бөгөөд түүний header нь
          нэвтэрсэн эсэхийг мэддэггүй тул хэрэглэгчид "нэвтэрч чадсангүй" мэт
          харагддаг байв. `fallback` нь зөвхөн URL-д `redirect_url` байхгүй үед
          хэрэглэгддэг тул `useRequireAuth`-ийн гүн холбоосууд хэвээр ажиллана. */}
      <SignIn fallbackRedirectUrl="/home" signUpUrl="/sign-up" />
    </div>
  )
}
