
import { Context } from "hono"
import { Category } from "../models/category.js"

export const getcategory = async (c: Context) => {
    try {
        const category = await Category.find()
        return c.json({ category })
    } catch (error) {
        return c.json({
            message: "aldaa garlaa"
        })
    }
}
export const postcategory = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { name, parent_id } = body
        const category = await Category.create({ name, parent_id })
        return c.json({
            message: "Amjilttai hadgallaa",
            category
        }, 201)
    } catch (error) {
        return c.json({
            message: "aldaa garlaa"
        }, 500)
    }
}