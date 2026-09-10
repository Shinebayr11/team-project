import { Context } from "hono";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

/**
 * GET /api/order — нэвтэрсэн хэрэглэгчийн ӨӨРТЭЙ НЬ ХОЛБООТОЙ захиалгууд.
 *
 * Өмнө нь энэ нь нүцгэн `Order.find()` байсан бөгөөд нэвтрэлт огт шаарддаггүй
 * байв: хүсэлт явуулсан ХЭН Ч системийн бүх захиалгыг — худалдан авагчийн нэр,
 * хүргэх хаяг, утас, худалдаж авсан зүйлийг нь бүгдийг татаж чаддаг байсан.
 *
 * Одоо худалдан авагч эсвэл худалдагчийн аль нэгээр нь оролцсон захиалга л
 * гарна. Худалдагчийн самбар `/mine`-ыг ашигладаг тул энэ нь голдуу худалдан
 * авагчийн "миний захиалгууд" болж хэрэглэгдэнэ.
 */
export const getOrder = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const data = await Order.find({
            $or: [{ buyer_id: userId }, { seller_id: userId }],
        }).sort({ createdAt: -1 })

        return c.json({ message: "Amjilttai avlaa", data }, 200)
    } catch (error) {
        console.error("getOrder алдаа:", error)
        return c.json({ message: "Захиалгыг уншиж чадсангүй" }, 500)
    }
}

/**
 * POST /api/order — захиалга үүсгэнэ.
 *
 * `buyer_id` нь ХҮСЭЛТИЙН БИЕЭС биш ТОКЕНООС ирнэ: өмнө нь биеэс авдаг байсан
 * тул хэн ч өөр хүний нэрээр захиалга үүсгэж чаддаг байв.
 *
 * `seller_id` ба захиалгын мөрийг бараанаас нь уншиж тавина — эс тэгвэл
 * захиалга үүсэх ч худалдагчийн самбарт (`/mine`) хэзээ ч харагдахгүй, дүн нь
 * тэг байна.
 *
 * ҮЛДСЭН ЦООРХОЙ: `price_coins` клиентээс ирсээр байна. Дуудлага худалдааны
 * эцсийн үнэ жагсаалтын үнээс өөр байдаг тул бараанаас нь хатуу авч болохгүй —
 * checkout-ыг бичих үед үнийг сервер тал дээр (бараа эсвэл ялсан санал) баталгаажуулна.
 */
export const postOrder = async (c: Context) => {
    try {
        const buyerId = c.get("userId")
        const body = await c.req.json()
        const { product_id, video_id, live_show_id, quantity, price_coins, status } = body

        if (!product_id || quantity === undefined || price_coins === undefined) {
            return c.json({ message: "shaardlagtai medeelel dutuu bn" }, 400)
        }

        const product = await Product.findById(product_id).select("seller_id name sku")
        if (!product) {
            return c.json({ message: "Бараа олдсонгүй" }, 404)
        }

        const data = await Order.create({
            buyer_id: buyerId,
            seller_id: product.seller_id,
            product_id,
            video_id,
            live_show_id,
            quantity,
            price_coins,
            status,
            items: [
                {
                    product_id,
                    name: product.name,
                    sku: product.sku ?? "",
                    price_coins,
                    quantity,
                },
            ],
            total_coins: price_coins * quantity,
        })

        return c.json({ message: "Amjilttai hadgallaa", data }, 201)
    } catch (error) {
        console.error("postOrder алдаа:", error)
        return c.json({ message: "Захиалга үүсгэж чадсангүй" }, 500)
    }
}

/**
 * GET /api/order/mine — нэвтэрсэн ХУДАЛДАГЧИЙН захиалгууд.
 *
 * Seller Hub-ын "Захиалга" ба "Аналитик" хоёр үүнийг уншина. `getOrder`-оос
 * ялгаатай нь энэ нь `seller_id`-аар хатуу шүүдэг тул худалдан авагчаар
 * оролцсон захиалга нь худалдагчийн самбарт хольцгүй.
 *
 * Хуучин, `seller_id`-гүй бичлэгүүд энд ОГТ ОРОХГҮЙ — тэдгээр нь нэг бараатай
 * хэлбэрийн туршилтын мөрүүд бөгөөд аль худалдагчийнх нь мэдэгдэхгүй.
 */
export const getMyOrders = async (c: Context) => {
    try {
        const sellerId = c.get("userId")
        const orders = await Order.find({ seller_id: sellerId }).sort({ createdAt: -1 })
        return c.json({ orders })
    } catch (error) {
        console.error("getMyOrders алдаа:", error)
        return c.json({ message: "Захиалгыг уншиж чадсангүй" }, 500)
    }
}
