import { getClient, getDB } from '../../configs/db.js';
import { ObjectId } from 'mongodb';
import OrderModel from './order.model.js';

export default class OrderRepository {
    constructor() {
        this.collectionName = 'orders';
    }

    async placeOrder(userId) {
        const db = getDB();
        const client = getClient();
        const session = client.startSession();

        try {
            session.startTransaction();

            // 1. Fetch user cart items with computed price.
            const userCartItems = await this._fetchUserCartItems(userId, session);

            if (!userCartItems.length) {
                throw new Error('Cart is empty');
            }

            // 2. Reduce stock.
            for (let item of userCartItems) {
                await db.collection('products').updateOne(
                    { _id: item.productId },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }

            // 3. Place order.
            const totalAmount = userCartItems.reduce((acc, item) => acc + item.totalAmount, 0);
            const order = new OrderModel(new ObjectId(userId),totalAmount,new Date());
               
            const result = await db.collection(this.collectionName).insertOne(order, { session });
            // throw new Error("Yup");
            // 4. Clear cart for user.
            await db.collection('cartItems').deleteMany({ userId: new ObjectId(userId) }, { session });

            await session.commitTransaction();
            session.endSession();
            console.log(result);
            return result.insertedId; // return the order
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async _fetchUserCartItems(userId, session) {
        console.log(userId)
        const pipeline = [
            {
                $match: { userId: new ObjectId(userId) }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            {
                $unwind: "$productInfo"
            },
            {
                $addFields: {
                    "totalAmount": { $multiply: ["$productInfo.price", "$quantity"] }
                }
            }
        ];
        console.log(await getDB().collection('cartItems').find({userId: new ObjectId(userId) }).toArray());
        return await getDB().collection('cartItems').aggregate(pipeline, { session }).toArray();
    }
}

