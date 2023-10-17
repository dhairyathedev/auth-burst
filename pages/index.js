import Link from 'next/link'
import React, { useEffect } from 'react'
const totp = require("totp-generator")

export default function Home() {
  useEffect(() => {
   const token = totp("JBSWY3DPFQQFO33SNRSCC===")
   console.log(token)
  })
  return (
    <>
      <div className="max-w-screen-sm mx-auto m-2 p-4"> 
        <h1 className="text-2xl font-semibold">TOTP Generator</h1>
        <div className="flex flex-col space-y-2 mt-4">
          <Link href="/login" className="underline text-primaryOrange">/Login</Link>
          <Link href="/signup" className="underline text-primaryOrange">/Welcome</Link>

        </div>
      </div>
    </>
  )
}
