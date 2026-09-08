/**
 * Хүснэгтийг CSV болгож татуулна. Excel нь BOM-гүй UTF-8-ыг кирилл биш гэж
 * уншдаг тул эхэнд BOM нэмнэ — үүнгүй бол монгол гарчиг эвдэрч гардаг.
 */
const cell = (value: string | number): string => {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export const downloadCsv = (
  filename: string,
  header: string[],
  rows: (string | number)[][]
): void => {
  const csv = [header, ...rows].map((row) => row.map(cell).join(",")).join("\n")
  const url = URL.createObjectURL(
    new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })
  )
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
