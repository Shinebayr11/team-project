import { Context } from "hono"
import { Wallet } from "../models/Wallet.js"
import { CoinTransaction } from "../models/Cointransaction.js"

export const getWallet = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const data = await Wallet.findOne({ user_id: userId })
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

export const topUpWallet = async (c: Context) => {
    try {
        const userId = c.get("userId");
        const body = await c.req.json();
        const { amount } = body;

        if (typeof amount !== "number" || amount <= 0) {
            return c.json(
                { message: "amount эерэг тоо байх ёстой" },
                400
            );
        }

        const data = await Wallet.findOneAndUpdate(
            { user_id: userId },
            { $inc: { coin_balance: amount } },
            { upsert: true, new: true }
        );

        await CoinTransaction.create({
            wallet_id: data._id,
            type: "topup",
            amount,
        });

        return c.json(
            {
                message: "Amjilttai hadgallaa",
                data,
            },
            200
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

