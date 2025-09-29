import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "../../../../dbConfig/dbConfig";
import Order from "../../../../models/Order";
import jwt from "jsonwebtoken";

connect();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productId, productName, productPrice } = body;

        // Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }

        // Get user from token
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);

        // Save order in DB
        const order = await Order.create({
            userId: decoded.id,
            productId,
            productName,
            productPrice,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            signature: razorpay_signature,
            status: "paid",
        });

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error("Payment verify error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
