"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/users/me", { method: "POST" })
            const data = await res.json()
            if (data.success) {
                setUser(data.data)
            }
        }
        fetchUser()
    }, [])

    const handleLogout = async () => {
        await fetch("/api/users/logout", { method: "GET" })
        router.push("/login")
    }

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl w-96"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
                {user ? (
                    <div className="space-y-3">
                        <p>
                            <span className="font-semibold">Username:</span> {user.username}
                        </p>
                        <p>
                            <span className="font-semibold">Email:</span> {user.email}
                        </p>
                        <p>
                            <span className="font-semibold">Verified:</span>{" "}
                            {user.isVerified ? "✅ Yes" : "❌ No"}
                        </p>
                        <button
                            onClick={handleLogout}
                            className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </motion.div>
        </motion.div>
    )
}
