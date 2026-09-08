"use client"

import { useEffect, useRef } from "react"

/**
 * Component гарч ирэхэд (мөн түлхүүр нь солигдоход) өгөгдлөө нэг удаа татна.
 *
 * Өмнө нь data hook бүр `useEffect(() => { refresh() }, [refresh])` гэсэн
 * ижилхэн гурван мөрийг давтдаг байсан — 20 гаруй газар. Нэг дор байрлуулснаар
 * татах дүрэм (хэзээ ажиллах, дахин ажиллах) бүгдэд ижил байна.
 *
 * `loader`-ыг ref-ээр дуудна: түүний дотор `setState` хийх нь хэвийн (татсан
 * өгөгдлөө хаа нэгтээ тавих ёстой) бөгөөд effect нь `loader`-ын хамаарал
 * өөрчлөгдсөн үед л дахин ажиллана.
 */
export function useLoad(loader: () => void, enabled = true) {
  const saved = useRef(loader)

  useEffect(() => {
    saved.current = loader
  }, [loader])

  useEffect(() => {
    if (enabled) saved.current()
  }, [loader, enabled])
}
