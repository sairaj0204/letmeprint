"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const token = otp
  const [message, setMessage] = useState("Verifying...")

  const verifyEmail = async () => {
    try {
      if (otp.length !== 6) {
        document.getElementById('mobileNo').innerHTML = "Please Enter a Valid OTP";
      }
      else {
        document.getElementById('mobileNo').innerHTML = ""
        const res = await fetch("/api/users/verifyUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })
        const data = await res.json()
        setMessage(data.message || data.error)

        // wait 3 seconds then redirect
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    }
    catch (err) {
      setMessage("Verification failed.")
    }

  }
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h1
        className="text-2xl font-bold"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div>
          <input
            type="number"
            placeholder="9172961047"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <label id='mobileNo'></label>
          <button onClick={verifyEmail}>Verify</button>

        </div>
        {message}
      </motion.h1>
    </motion.div>
  )
}
