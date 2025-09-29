// components/AdminOrders.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type OrderProduct = {
    product?: { _id: string; name?: string; price?: number; image?: string } | string;
    name?: string;
    price?: number;
    quantity: number;
};

type OrderType = {
    _id: string;
    user?: { _id?: string; email?: string; userName?: string } | string;
    products: OrderProduct[];
    total: number;
    status: string;
    createdAt: string;
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get("/api/admin/showOrders");
                if (res.data?.success) setOrders(res.data.orders || []);
            } catch (err) {
                console.error("Failed to fetch admin orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div>Loading orders...</div>;
    if (orders.length === 0) return <div>No orders yet.</div>;

    return (
        <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
            <table className="min-w-full text-sm text-left">
                <thead>
                    <tr className="border-b">
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">User</th>
                        <th className="px-4 py-2">Products</th>
                        <th className="px-4 py-2">Total</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o) => (
                        <tr key={o._id} className="border-b align-top">
                            <td className="px-4 py-2">{o._id}</td>
                            <td className="px-4 py-2">
                                {(o.user && typeof o.user === "object" && (o.user.userName || o.user.email)) ||
                                    (typeof o.user === "string" ? o.user : "—")}
                            </td>

                            <td className="px-4 py-2">
                                {o.products.map((pr, idx) => {
                                    // pr.product may be populated (object) or just an id/legacy fields
                                    const productName =
                                        (pr.product && typeof pr.product === "object" && (pr.product as any).name) ||
                                        pr.name ||
                                        (typeof pr.product === "string" ? pr.product : "Unknown");
                                    const price = pr.price ?? ((pr.product && typeof pr.product === "object" && (pr.product as any).price) || "—");
                                    return (
                                        <div key={idx} className="mb-1">
                                            <span className="font-medium">{productName}</span>{" "}
                                            <span className="text-gray-600">x{pr.quantity}</span>{" "}
                                            <span className="text-gray-800">₹{price}</span>
                                        </div>
                                    );
                                })}
                            </td>

                            <td className="px-4 py-2">₹{o.total}</td>
                            <td className="px-4 py-2">{o.status}</td>
                            <td className="px-4 py-2">{new Date(o.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
