// models/Order.ts
import mongoose, { model, models, Schema } from "mongoose";
import Products from "./Products";
import { deflate } from "zlib";

// interface IOrder extends Document {
//     user: mongoose.Types.ObjectId; // Reference to User
//     products: {
//         product: mongoose.Types.ObjectId;
//         quantity: number;
//     }[];
//     paymentId: string;
//     orderId: string;
//     signature: string;
//     status: "pending" | "paid" | "failed";
//     createdAt: Date;
// }

// const orderSchema = new Schema<IOrder>(
//     {
//         user: { type: Schema.Types.ObjectId, ref: "User", required: true },

//         products: [
//             {
//                 product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
//                 quantity: { type: Number, default: 1 },
//             },
//         ],

//         paymentId: { type: String, required: true },
//         orderId: { type: String, required: true },
//         signature: { type: String, required: true },
//         status: {
//             type: String,
//             enum: ["pending", "paid", "failed"],
//             default: "pending",
//         },
//     },
//     { timestamps: true }
// );

// const Order: Model<IOrder> =
//     mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

// export default Order;


const orderSchema = new Schema({
    user: mongoose.Types.ObjectId,
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: Products,
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    paymentId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
    },
    shipingStatus: String,
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    razorpayPaymentId: {
        type: String,
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }

})

const Order = models?.Order || model("Order", orderSchema)
export default Order