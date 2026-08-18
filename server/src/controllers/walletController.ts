import { Context } from "hono"
import { Wallet } from "../models/Wallet.js"

export const getWallet = async (c: Context) => {
    try {
        const data = await Wallet.find()
        return c.json({
            message: "Amjilttai avlaa",
            data
        }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa "
        }, 500)
    }

}
export const postWallet = async (c: Context) => {
    try {
        const userId = c.get("userId"); // Auth middleware-ээс ирнэ
        const body = await c.req.json();
        const { coin_balance } = body;

        if (coin_balance === undefined) {
            return c.json(
                {
                    message: "coin_balance shaardlagtai",
                },
                400
            );
        }

        const existingWallet = await Wallet.findOne({
            user_id: userId,
        });

        if (existingWallet) {
            return c.json(
                {
                    message: "Wallet ali hediin vvssen baina",
                },
                409
            );
        }

        const data = await Wallet.create({
            user_id: userId,
            coin_balance,
        });

        return c.json(
            {
                message: "Amjilttai hadgallaa",
                data,
            },
            201
        );
    } catch (error) {
        return c.json(
            {
                message: "Aldaa garlaa",
            },
            500
        );
    }
};

