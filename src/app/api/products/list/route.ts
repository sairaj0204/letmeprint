import { NextResponse, NextRequest } from "next/server"
import { connect } from "../../../../dbConfig/dbConfig";
import Product, { IProduct } from "../../../../models/Products";
import mongoose, { Model } from "mongoose";


connect()

export async function GET(req: NextRequest) {
    try {
        console.log("📦 /api/products/list called") // debug
        const products = await (Product as Model<IProduct>).find().sort({ createdAt: -1 })
        console.log("✅ Products fetched:", products.length)
        return NextResponse.json({ success: true, products })
    } catch (error: any) {
        console.error("❌ Error in /api/products/list:", error.message)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

