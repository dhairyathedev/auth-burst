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
        <form className="mt-4 flex flex-col space-y-4">
          <input type="text" className="border border-gray-500 focus:ring-0 focus:outline-none px-2 rounded-sm" placeholder="Enter TOTP Key" />
          <button type="submit" className="bg-gray-100 text-xl font-medium py-2 rounded-md">Submit</button>
        </form>
      </div>
    </>
  )
}
