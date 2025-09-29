"use client"

import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function NavBar({ user }: { user: any | null }) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await axios.get("/api/users/logout")
            router.push("/login")
        } catch {
            // ignore
        }
    }

    return (
        <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-extrabold text-xl text-gray-900">
                        🛍️ MyShop
                    </Link>
                    <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
                        <Link href="/cart" className="hover:text-gray-900 transition">Cart</Link>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {user?.isAdmin && (
                        <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded-full border border-amber-200">
                            Admin
                        </span>
                    )}

                    {user ? (
                        <>
                            <span className="hidden sm:block text-sm text-gray-700">
                                Hi, <span className="font-semibold">{user.userName || user.username || user.email}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition text-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
