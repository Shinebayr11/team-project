import mongoose from "mongoose";
import 'dotenv/config'
export const connectDb = async () => {

    try {
        const URI = process.env.MONGODB_URI;
        if (!URI) {
            console.log("MONGODB_URI олдсонгүй ");
            return;
        }
        await mongoose.connect(URI);
        console.log("DB амжилттай холбогдлоо ");
    } catch (error) {
        console.log("DB холбогдоход алдаа гарлаа ", error);
    }
};
