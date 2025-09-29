"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation"

export default function CheckoutPage() {
    const searchParams = useSearchParams()
    const productId = searchParams.get("pId")
    const [product, setProduct] = useState<any>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/api/products/${productId}`)
                setProduct(res.data.product)
            } catch {
                alert("Failed to load product")
            }
        }
        if (productId) fetchProduct()
    }, [productId])

    const handlePayment = async () => {
        try {
            const res = await axios.post("/api/razorpay/order", {
                productId: product._id,
                amount: product.price,
            })

            const { orderId, key } = res.data

            const options = {
                key,
                amount: product.price * 100,
                currency: "INR",
                name: "MyShop",
                description: `Payment for ${product.name}`,
                order_id: orderId,
                handler: async function (response: any) {
                    await axios.post("/api/razorpay/verify", {
                        productId: product._id,
                        productName: product.name,
                        productPrice: product.price,
                        ...response,
                    })
                    window.location.href = "/success"
                },
                theme: { color: "#3399cc" },
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.open()
        } catch (err) {
            console.error(err)
            alert("Payment initiation failed")
        }
    }

    if (!product) return <p className="text-center mt-20">Loading product...</p>

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <div className="bg-white shadow-md p-6 rounded-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                <p className="mb-2 text-gray-700">{product.description}</p>
                <p className="text-xl font-semibold mb-4">₹{product.price}</p>
                <button
                    onClick={handlePayment}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
                >
                    Pay Now
                </button>
            </div>
        </div>
    )
}
