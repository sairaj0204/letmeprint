// src/app/api/products/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose, { Model } from "mongoose"; // Import Model from Mongoose
import Products, { IProduct } from "../../../../models/Products";
import { connect } from "../../../../dbConfig/dbConfig";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import User from "../../../../models/userModel";

// ✅ GET: fetch a product
export async function GET(
    req: NextRequest,
    { params }: { params: { productId: string } }
) {
    try {
        await connect();
        const { productId } = await params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID" },
                { status: 400 }
            );
        }

        // Apply a type assertion to guarantee 'Products' is a Mongoose Model.
        const product = await (Products as Model<IProduct>).findById(productId).exec();

        if (!product) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, product });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}