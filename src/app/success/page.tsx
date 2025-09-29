"use client"
import { useRouter } from "next/navigation"
export default function SuccessPage() {
    const router = useRouter()
    setTimeout(() => {
        router.push("/orders")
    }, 3000)
    return (
        <div className="min-h-screen flex justify-center items-center bg-green-50">
            <h1 className="text-3xl font-bold text-green-700">✅ Payment Successful!</h1>
        </div>
    )
}