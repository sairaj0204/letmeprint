import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options = {
            amount: body.amount * 100, // amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.error("Razorpay order error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
