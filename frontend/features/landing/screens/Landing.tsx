import { apiFetch } from "@/lib/api"
import { LiveShowDoc, toHomeShow } from "@/lib/liveShows"

import { Hero } from "../components/Hero"
import { HowItWorks } from "../components/HowItWorks"
import { JoinCta } from "../components/JoinCta"
import { LandingFooter } from "../components/LandingFooter"
import { LandingHeader } from "../components/LandingHeader"
import { LiveNow } from "../components/LiveNow"

/** Shows in the grid below the hero (the featured one is pulled out of it). */
const GRID_SIZE = 8

/**
 * The public front door at "/". Everything here is readable signed out: the
 * live grid links straight into /live-show, and the header always offers
 * Нэвтрэх / Бүртгүүлэх — the page never branches on auth state, so it stays
 * fully static.
 */
export async function Landing() {
  const shows = await apiFetch<{ data: LiveShowDoc[] }>("/api/liveshow")
    .then((res) => res.data.map(toHomeShow))
    .catch(() => [])

  const liveShows = shows.filter((show) => show.live).sort(
    (a, b) => (b.live ?? 0) - (a.live ?? 0)
  )
  const [featured, ...rest] = liveShows
  const watching = liveShows.reduce(
    (total, show) => total + (show.live ?? 0),
    0
  )

  return (
    <>
      <LandingHeader />
      <main>
        <Hero
          liveCount={liveShows.length}
          watching={watching}
          featured={featured}
        />
        <LiveNow shows={rest.slice(0, GRID_SIZE)} />
        <HowItWorks />
        <JoinCta />
      </main>
      <LandingFooter />
    </>
  )
}
