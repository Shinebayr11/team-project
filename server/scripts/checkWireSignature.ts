/**
 * `lib/wire.ts`-ийн гарын үсэг шалгагчийн шалгалт — webhook-ийн ГАНЦ хамгаалалт
 * тул эвдэрвэл хэн ч өөрийгөө цэнэглэх боломжтой болно.
 *
 *   npm run check:wire-signature
 */
import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import { isValidSignature } from "../src/lib/wire.js"

const secret = "whsec_test"
const body = JSON.stringify({ type: "payment_intent.succeeded", data: { object: { id: "pi_1" } } })
const sign = (t: number, payload = body, key = secret) =>
    `t=${t},v1=${createHmac("sha256", key).update(`${t}.${payload}`).digest("hex")}`

const now = Math.floor(Date.now() / 1000)

assert.equal(isValidSignature(secret, sign(now), body), true, "зөв гарын үсгийг зөвшөөрөх ёстой")
assert.equal(isValidSignature(secret, sign(now), body + " "), false, "биеийг өөрчилвөл татгалзах ёстой")
assert.equal(isValidSignature(secret, sign(now, body, "өөр"), body), false, "өөр түлхүүрийг татгалзах ёстой")
assert.equal(isValidSignature(secret, sign(now - 400), body), false, "хуучирсныг татгалзах ёстой")
assert.equal(isValidSignature(secret, "", body), false, "хоосон толгойг татгалзах ёстой")
assert.equal(isValidSignature(secret, `t=${now},v1=deadbeef`, body), false, "богино hex-ийг татгалзах ёстой")

console.log("wire signature: OK")
