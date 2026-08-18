/**
 * The marketing surface owns "/" and deliberately skips AppShell: the landing
 * page brings its own header and footer rather than the shopper topbar, and it
 * needs no store — nothing on it reads cart, credits or messages.
 *
 * `whynot-root` is still required: it scopes the --wn-* design tokens the whole
 * UI is drawn with (see app/globals.css).
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="whynot-root min-h-svh">{children}</div>
}
