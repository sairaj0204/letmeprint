// // src/app/api/admin/orders/[orderId]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connect } from "../../../../../dbConfig/dbConfig";
// import Order from "../../../../../models/Order";
// import User from "../../../../../models/userModel";
// import { getDataFromToken } from "../../../../../helpers/getDataFromToken";
// import type { Model } from "mongoose";
// import type { IProduct } from "../../../../../models/Products";

// export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
//     try {
//         await connect();
//         const userId = await getDataFromToken(req);
//         if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

//         const adminUser = await User.findById(userId).lean();
//         if (!adminUser?.isAdmin) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

//         const { orderId } = params;
//         const body = await req.json();
//         const { status } = body;
//         if (!status) return NextResponse.json({ success: false, error: "Status required" }, { status: 400 });

//         const updated = await (Order as Model<IProduct>).findByIdAndUpdate(orderId, { $set: { status } }, { new: true }).lean();
//         if (!updated) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

//         return NextResponse.json({ success: true, order: updated });
//     } catch (err: any) {
//         console.error("Error updating order:", err);
//         return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
//     }
// }
