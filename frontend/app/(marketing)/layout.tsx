/**
 * The marketing surface owns "/" and deliberately skips AppShell: the landing
 * page brings its own header and footer rather than the shopper topbar, and it
 * needs no store — nothing on it reads cart, credits or messages.
 *
 * `whynot-root` is still required: it scopes the --wn-* design tokens the whole
 * UI is drawn with (see app/globals.css).
 *
 * Its background is cleared here, though: the landing page paints the page
 * background itself from a fixed layer that morphs colour on scroll
 * (features/landing/components/BackgroundMorph.tsx). `.whynot-root` is an
 * unlayered rule, so a Tailwind utility could not win against it — the inline
 * style is what actually clears the paint.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="whynot-root min-h-svh"
      style={{ backgroundColor: "transparent" }}
    >
      {children}
    </div>
  )
}
