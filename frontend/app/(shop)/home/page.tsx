import { redirect } from "next/navigation"

// The old Reelshop feed lived at /home; the WhyNot feed is the site root now.
export default function Page() {
  redirect("/")
}
