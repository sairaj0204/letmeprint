import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbConfig/dbConfig";
import Order from "../../../../models/Order";
import jwt from "jsonwebtoken";

connect();

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);

        const orders = await Order.find({ userId: decoded.id }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
