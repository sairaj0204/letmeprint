import { NextRequest, NextResponse } from "next/server";
import mongoose, { Model } from "mongoose";
import Product, { IProduct } from "../../../../../models/Products";
import { connect } from "../../../../../dbConfig/dbConfig";
import { getDataFromToken } from "../../../../../helpers/getDataFromToken";
import User from "../../../../../models/userModel";

export async function PUT(
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

        // 🔐 Verify user and check admin
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return NextResponse.json(
                { success: false, error: "Not authorized" },
                { status: 403 }
            );
        }

        const body = await req.json();

        // Only allow updating selected fields
        const updateData: Partial<{
            name: string;
            description: string;
            price: number;
            image: string;
            stock: number;
            category: string;
            dimensions: string;
        }> = {};

        if (body.name) updateData.name = body.name;
        if (body.description) updateData.description = body.description;
        if (body.price !== undefined) updateData.price = Number(body.price);
        if (body.image) updateData.image = body.image;
        if (body.stock !== undefined) updateData.stock = Number(body.stock);
        if (body.category) updateData.category = body.category;
        if (body.dimensions) updateData.dimensions = body.dimensions;

        const updatedProduct = await (Product as Model<IProduct>).findByIdAndUpdate(
            productId,
            { $set: updateData },
            { new: true }
        ).exec();

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, product: updatedProduct });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, error: "Failed to update product" },
            { status: 500 }
        );
    }
}
