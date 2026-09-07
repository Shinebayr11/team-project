import type { ComponentProps } from "react"
import type { ClerkProvider } from "@clerk/nextjs"

/**
 * Clerk-ийн `localization` prop-ын төрөл. `@clerk/types` тусад нь суулгагдаагүй
 * тул компонентын өөрийнх нь prop-оос гаргаж авав — түлхүүр буруу бичвэл
 * `tsc` шууд барина.
 */
type ClerkLocalization = NonNullable<
  ComponentProps<typeof ClerkProvider>["localization"]
>

/**
 * Нэвтрэх, бүртгүүлэх цонхны монгол бичиг.
 *
 * Clerk албан ёсны монгол хэл дэмждэггүй тул ашигладаг түлхүүрүүдээ л дарж
 * бичнэ — орчуулаагүй үлдсэн зүйл нь англиараа хэвээр гарна.
 */
export const clerkMongolian: ClerkLocalization = {
  socialButtonsBlockButton: "{{provider|titleize}}-ээр үргэлжлүүлэх",
  dividerText: "эсвэл",
  formButtonPrimary: "Үргэлжлүүлэх",
  backButton: "Буцах",
  footerActionLink__useAnotherMethod: "Өөр аргаар нэвтрэх",

  formFieldLabel__emailAddress: "И-мэйл хаяг",
  formFieldLabel__phoneNumber: "Утасны дугаар",
  formFieldLabel__password: "Нууц үг",
  formFieldLabel__confirmPassword: "Нууц үг давтах",
  formFieldLabel__firstName: "Нэр",
  formFieldLabel__lastName: "Овог",
  formFieldLabel__username: "Хэрэглэгчийн нэр",
  formFieldLabel__emailAddress_username: "И-мэйл эсвэл хэрэглэгчийн нэр",

  formFieldInputPlaceholder__emailAddress: "И-мэйл хаягаа оруулна уу",
  formFieldInputPlaceholder__phoneNumber: "Утасны дугаараа оруулна уу",
  formFieldInputPlaceholder__password: "Нууц үгээ оруулна уу",
  formFieldInputPlaceholder__firstName: "Нэр",
  formFieldInputPlaceholder__lastName: "Овог",
  formFieldInputPlaceholder__username: "Хэрэглэгчийн нэр",
  formFieldInputPlaceholder__emailAddress_username: "И-мэйл эсвэл хэрэглэгчийн нэр",

  signIn: {
    start: {
      title: "Нэвтрэх",
      subtitle: "Үргэлжлүүлэхийн тулд нэвтэрнэ үү.",
      actionText: "Бүртгэлгүй юу?",
      actionLink: "Бүртгүүлэх",
    },
    password: {
      title: "Нууц үгээ оруулна уу",
      subtitle: "Бүртгэлдээ холбогдсон нууц үгээ оруулна уу.",
      actionLink: "Өөр аргаар нэвтрэх",
    },
    emailCode: {
      title: "И-мэйлээ шалгана уу",
      subtitle: "Үргэлжлүүлэхийн тулд и-мэйлээр ирсэн кодыг оруулна уу.",
      formTitle: "Баталгаажуулах код",
      resendButton: "Код дахин илгээх",
    },
    phoneCode: {
      title: "Утсаа шалгана уу",
      subtitle: "Үргэлжлүүлэхийн тулд мессежээр ирсэн кодыг оруулна уу.",
      formTitle: "Баталгаажуулах код",
      resendButton: "Код дахин илгээх",
    },
  },

  signUp: {
    start: {
      title: "Бүртгэл үүсгэх",
      subtitle: "Тавтай морил! Эхлэхийн тулд мэдээллээ бөглөнө үү.",
      actionText: "Бүртгэлтэй юу?",
      actionLink: "Нэвтрэх",
    },
    emailCode: {
      title: "И-мэйлээ баталгаажуулна уу",
      subtitle: "Үргэлжлүүлэхийн тулд и-мэйлээр ирсэн кодыг оруулна уу.",
      formTitle: "Баталгаажуулах код",
      formSubtitle: "И-мэйлээр ирсэн кодыг оруулна уу.",
      resendButton: "Код дахин илгээх",
    },
    phoneCode: {
      title: "Утсаа баталгаажуулна уу",
      subtitle: "Үргэлжлүүлэхийн тулд мессежээр ирсэн кодыг оруулна уу.",
      formTitle: "Баталгаажуулах код",
      formSubtitle: "Утсанд ирсэн кодыг оруулна уу.",
      resendButton: "Код дахин илгээх",
    },
    continue: {
      title: "Дутуу мэдээллээ нөхнө үү",
      subtitle: "Үргэлжлүүлэхийн тулд үлдсэн талбарыг бөглөнө үү.",
      actionText: "Бүртгэлтэй юу?",
      actionLink: "Нэвтрэх",
    },
  },

  userButton: {
    action__signOut: "Гарах",
    action__manageAccount: "Бүртгэл удирдах",
    action__addAccount: "Бүртгэл нэмэх",
  },
}
