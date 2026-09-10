/**
 * Байршуулах замын ХАМГААЛАЛТЫН шалгалт.
 *
 * Ажиллуулах: `node --experimental-strip-types lib/upload.check.ts`
 *
 * Энэ салаа эвдэрвэл нэвтэрсэн ямар ч хэрэглэгч `path` талбараар дамжуулан
 * бусдын файлыг дарж бичнэ — тиймээс энд ганц ч framework-гүй, гар аргаар.
 */
import assert from "node:assert"

import { blobTarget } from "./upload.ts"

// Клиент өөр хүний зам явуулсан ч ӨӨРИЙН хавтаснаасаа гарч чадахгүй.
assert.equal(
  blobTarget("me", "live-shows/victim.jpg", "x.jpg").pathname,
  "uploads/me/victim.jpg"
)
assert.equal(
  blobTarget("me", "../../other-user/victim.jpg", "x.jpg").pathname,
  "uploads/me/victim.jpg"
)

// Тогтмол зам ирвэл дарж бичнэ; эс бөгөөс санамсаргүй дагавартай шинэ файл.
assert.equal(blobTarget("me", "abc123.jpg", "x.jpg").fixed, true)
assert.equal(blobTarget("me", null, "x.jpg").fixed, false)
assert.equal(blobTarget("me", "", "x.jpg").fixed, false)
assert.equal(blobTarget("me", "..", "x.jpg").fixed, false)
assert.equal(blobTarget("me", ".hidden", "x.jpg").fixed, false)

// Файлын нэр ч мөн адил зөвхөн сүүлийн хэсгээрээ орно.
assert.equal(blobTarget("me", null, "a/b/c.jpg").pathname, "uploads/me/c.jpg")
assert.equal(blobTarget("me", null, "").pathname, "uploads/me/upload")

console.log("upload.check: ok")
