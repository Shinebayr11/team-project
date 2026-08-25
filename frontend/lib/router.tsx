"use client"

/**
 * react-router-dom compatibility shim for the Next.js App Router.
 *
 * The WhyNot UI was authored against react-router with absolute paths ("/shop",
 * "/seller/orders"), and it is mounted at those same paths here. WHYNOT_BASE
 * stays as a single knob in case the UI ever needs to move under a prefix —
 * set it to e.g. "/whynot" and every Link/navigate follows.
 */

import React from "react"
import NextLink from "next/link"
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation"

/** Mount point of the WhyNot UI. "" means it owns the site root. */
export const WHYNOT_BASE: string = ""

/** "/shop" -> "<base>/shop". External/relative hrefs pass through. */
export const withBase = (to: string): string => {
  if (!WHYNOT_BASE) return to
  if (!to.startsWith("/")) return to
  return to === "/" ? WHYNOT_BASE : `${WHYNOT_BASE}${to}`
}

/** Inverse of withBase, so route-matching logic inside the UI still sees "/seller". */
export const stripBase = (path: string): string => {
  if (!WHYNOT_BASE) return path
  if (path === WHYNOT_BASE) return "/"
  if (path.startsWith(`${WHYNOT_BASE}/`)) return path.slice(WHYNOT_BASE.length)
  return path
}

type LinkProps = Omit<React.ComponentPropsWithoutRef<typeof NextLink>, "href"> & {
  to: string
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link({ to, ...rest }, ref) {
    return <NextLink ref={ref} href={withBase(to)} {...rest} />
  }
)

export type NavigateOptions = { replace?: boolean }
export type NavigateFn = (to: string | number, options?: NavigateOptions) => void

export const useNavigate = (): NavigateFn => {
  const router = useRouter()

  return React.useCallback<NavigateFn>(
    (to, options) => {
      if (typeof to === "number") {
        if (to < 0) router.back()
        else router.forward()
        return
      }
      const href = withBase(to)
      if (options?.replace) router.replace(href)
      else router.push(href)
    },
    [router]
  )
}

/**
 * Deliberately does not read the query string: useSearchParams() forces every
 * caller into a Suspense boundary, and the only consumers here (Topbar,
 * SellerHubLayout) match on pathname.
 */
export const useLocation = () => {
  const pathname = usePathname() || WHYNOT_BASE || "/"

  return React.useMemo(
    () => ({
      pathname: stripBase(pathname),
      hash: "",
      state: null,
      key: "default",
    }),
    [pathname]
  )
}

type SearchParamsInit =
  | URLSearchParams
  | Record<string, string>
  | ((prev: URLSearchParams) => URLSearchParams)

export type SetSearchParams = (
  next: SearchParamsInit,
  options?: NavigateOptions
) => void

export const useSearchParams = (): [URLSearchParams, SetSearchParams] => {
  const router = useRouter()
  const pathname = usePathname() || WHYNOT_BASE || "/"
  const current = useNextSearchParams()

  const params = React.useMemo(
    () => new URLSearchParams(current?.toString() ?? ""),
    [current]
  )

  const setSearchParams = React.useCallback<SetSearchParams>(
    (next, options) => {
      const resolved =
        typeof next === "function"
          ? next(new URLSearchParams(params.toString()))
          : next instanceof URLSearchParams
            ? next
            : new URLSearchParams(next)

      const query = resolved.toString()
      // pathname is already base-prefixed — push it verbatim.
      const href = query ? `${pathname}?${query}` : pathname
      if (options?.replace) router.replace(href)
      else router.push(href)
    },
    [params, pathname, router]
  )

  return [params, setSearchParams]
}
