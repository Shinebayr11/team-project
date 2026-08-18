import { Context } from "hono"
import { Product } from "../models/Product.js"

export const getProduct = async (c: Context) => {
    try {
        const products = await Product.find()
        return c.json({ products })
    } catch (error) {
        return c.json({
            message: "aldaa garlaa"
        }, 500)
    }

}
export const postProduct = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { seller_id, name, description, price_coins, stock_quantity, images, category_id } = body
        const product = await Product.create({
            seller_id, name, description, price_coins, stock_quantity, images, category_id,
        })
        if (
            !seller_id ||
            !name ||
            price_coins === undefined ||
            stock_quantity === undefined ||
            !category_id
        ) {
            return c.json(
                {
                    message: "Shaardlagtai medeelel dutuu bn",
                },
                400
            );
        }
        return c.json({
            message: "amjilttai hadgallaa",
            product
        }, 201)
    } catch (error) {
        return c.json({
            message: "aldaa garlaa"
        }, 500)
    }
}