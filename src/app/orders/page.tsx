"use client"
import { useEffect, useState } from "react"
import axios from "axios"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("/api/orders/my")
                if (res.data.success) {
                    setOrders(res.data.orders)
                }
            } catch {
                console.error("Failed to fetch orders")
            }
        }
        fetchOrders()
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-600">No orders yet.</p>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order._id} className="border p-4 rounded bg-white shadow">
                            <h2 className="font-semibold">{order.productName}</h2>
                            <p>₹{order.productPrice}</p>
                            <p>Status: <span className="font-medium">{order.status}</span></p>
                            <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
