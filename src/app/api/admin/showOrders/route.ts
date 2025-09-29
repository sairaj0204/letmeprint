// src/app/api/admin/showOrders/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { connect } from "../../../../dbConfig/dbConfig";
import Order from "../../../../models/Order";
import User from "../../../../models/userModel";
import { getDataFromToken } from "../../../../helpers/getDataFromToken"; // assumes you already have this helper
import type { IProduct } from "../../../../models/Products";
import { Model } from "mongoose";

// src/app/api/admin/showOrders/route.ts

export async function GET() {
    try {
        await connect();

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "email userName") // fetch only email + userName
            .populate("products.product", "name price image"); // fetch product details

        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
