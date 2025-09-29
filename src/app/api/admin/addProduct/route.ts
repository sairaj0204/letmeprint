import { NextRequest, NextResponse } from "next/server";
import mongoose, { Model } from "mongoose";
import Product, { IProduct } from "../../../../models/Products";
import { connect } from "../../../../dbConfig/dbConfig";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import User from "../../../../models/userModel";

export async function POST(req: NextRequest) {
    try {
        await connect();

        const userId = getDataFromToken(req); // check logged in user
        const user = await User.findById(userId);

        if (!user || !user.isAdmin) {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        const body = await req.json();
        const product = await (Product as Model<IProduct>).create(body);

        return NextResponse.json({ success: true, product });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
