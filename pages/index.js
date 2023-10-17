import Image from 'next/image'
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
        <Image src="/logo.svg" width={210} height={51} alt="AuthBurst" />
        <div className="flex flex-col space-y-2 mt-10">
          <Link href="/login" className="underline">/Login</Link>
          <Link href="/signup" className="underline">/Welcome</Link>

        </div>
      </div>
    </>
  )
}
