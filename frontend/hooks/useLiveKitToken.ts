"use client"

import { useCallback, useRef, useState } from "react"

import { useApiClient } from "./useApiClient"
import { useDisplayName } from "./useDisplayName"
import { useLoad } from "./useLoad"

export interface LiveStream {
  token: string | null
  /** LiveKit серверийн хаяг — серверээс ирнэ, клиент дээр тохируулахгүй. */
  url: string | null
  /**
   * Дамжуулах эрх. Үүнийг ЗӨВХӨН сервер шийднэ (дамжуулалтын эзэн мөн эсэх).
   *
   * Өмнө нь клиент `canPublish`-ээ өөрөө сонгож, нэвтрэлтгүй endpoint рүү
   * илгээдэг байсан тул `/live/:room?host=1` гэж хаягаа бичсэн ямар ч хүн
   * өөр хүний өрөөнд орж дамжуулах боломжтой байв.
   */
  isHost: boolean
  error: string | null
  loading: boolean
}

interface TokenResponse {
  token: string
  url: string
  roomName: string
  isHost: boolean
}

const IDLE: LiveStream = {
  token: null,
  url: null,
  isHost: false,
  error: null,
  loading: true,
}

const NO_SHOW: LiveStream = { ...IDLE, loading: false, error: "Дамжуулалт олдсонгүй" }

/**
 * Дамжуулалтын LiveKit token-ыг серверээс авна.
 *
 * Түлхүүр нь өрөөний нэр БИШ, дамжуулалтын id: өрөөг дамжуулалтаас нь сервер олж,
 * эрхийг нь тэндээ шийднэ.
 */
export function useLiveKitToken(showId?: string): LiveStream {
  const { callApi } = useApiClient()
  const { displayName, isLoaded } = useDisplayName()
  const [state, setState] = useState<LiveStream>(IDLE)
  /** Хоцорч ирсэн хариу шинэ дамжуулалтын token-ыг дарж бичихээс сэргийлнэ. */
  const latest = useRef(0)

  const load = useCallback(() => {
    // Clerk-ийг хүлээнэ: эрт татвал "Зочин" нэртэй token гараад, жинхэнэ нэр
    // ирэхэд өрөөнд дахин холбогдоно.
    if (!showId || !isLoaded) return

    const ticket = ++latest.current

    callApi<TokenResponse>(`/api/liveshow/${showId}/token`, {
      method: "POST",
      body: JSON.stringify({ name: displayName }),
    })
      .then((data) => {
        if (ticket !== latest.current) return
        setState({
          token: data.token,
          url: data.url,
          isHost: data.isHost,
          error: null,
          loading: false,
        })
      })
      .catch((error: unknown) => {
        if (ticket !== latest.current) return
        setState({
          ...IDLE,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Дамжуулалтад холбогдож чадсангүй",
        })
      })
  }, [showId, isLoaded, displayName, callApi])

  useLoad(load)

  return showId ? state : NO_SHOW
}
