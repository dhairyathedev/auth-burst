
import { supabase } from '@/lib/supabase'
import { inter } from '@/styles/font'
import { HomeIcon, ReloadIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import jwt from "jsonwebtoken"
import encrypt, { decodeTOTPToken, hashTOTPToken } from '@/hooks/auth/encrypt'
import toast, { Toaster } from 'react-hot-toast'
import IsAuthenticated from '@/hooks/auth/isAuthenticated'
import { useRouter } from 'next/router'
import Link from 'next/link'
export default function Settings() {
  const [loading, setLoading] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [user, setUser] = useState([])
  const [autoLogout, setAutoLogout] = useState(null)
  const router = useRouter()
  useEffect(() => {
    async function fetchUser() {
      const decodedToken = jwt.verify(localStorage.getItem("authToken"), process.env.NEXT_PUBLIC_JWT_SECRET_KEY);
      const { data, error } = await supabase.from("users").select("*").eq("uid", decodedToken.userId)
      setUser(data[0])
    }
    setAutoLogout(localStorage.getItem("autoLogout") === "1" ? true : false)
    fetchUser()
  }, [])

  async function updateAndRehashTotpTokens(userId, newPassword) {
    // Fetch the TOTP tokens associated with the user
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('uid', userId);

    if (error) {
      console.error('Error fetching tokens:', error);
      return;
    }

    // Iterate through the tokens and update/rehash them
    for (const tokenData of data) {
      const { token, id } = tokenData;

      // Decrypt the old token using the old password
      const oldDecryptedToken = decodeTOTPToken(token, user.password, userId);
      // Rehash the token using the new password
      const newHashedToken = hashTOTPToken(oldDecryptedToken, newPassword, userId);

      // Update the token in the database with the new hashed token
      const { data: updatedData, error: updateError } = await supabase
        .from('tokens')
        .update({ token: newHashedToken })
        .eq('id', id);
      if (updateError) {
        console.error('Error updating token:', updateError);
      }
    }
  }

  async function handleSaveNewPassword(e) {
    e.preventDefault()
    try {
      if (newPassword === confirmNewPassword) {
        setLoading(true)
        const { password: newHash } = encrypt(oldPassword, user.salt) // checks if the entered password is matched with the old hashed password
        if (newHash === user.password) {
          const { password, salt } = encrypt(newPassword)
          const { data, error } = await supabase.from("users").update({
            password,
            salt
          }).eq("uid", user.uid).select()
          if (data) {
            console.log(data)
            await updateAndRehashTotpTokens(user.uid, password).then(() => {
              toast.success("Password has been changed!")
              localStorage.removeItem("authToken")
              router.push("/login")
              setLoading(false)
            });
          }
        } else {
          toast.error("Old password is incorrect")
        }
      } else {
        toast.error("Passwords don't match")
      }
    } catch (error) {
      console.log(error)
      throw error
    }
    setLoading(false)
  }
  IsAuthenticated()
  return (
    <>
      <Toaster />
      <div className="max-w-screen-md mx-auto m-2 mt-8 p-4">
      <div className="flex justify-between items-center">
          <Image src="/logo.svg" width={210} height={51} alt="AuthBurst" />
          <Link href={"/app/"}>
            <HomeIcon className="w-6 h-6 text-textSecondary hover:text-primaryOrange"/>
          </Link>
        </div>

        <main className={`mt-20 ${inter.className}`}>
          <form className="flex flex-col space-y-1">
            <label className="font-semibold text-lg text-gray-800">Email</label>
            <input
              type="text"
              className="rounded-md bg-backgroundSecondary text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all"
              value={user.email}
              disabled={1}
            />
          </form>
          <form className="flex flex-col space-y-4 mt-10" onSubmit={(e) => handleSaveNewPassword(e)}>
            <div>
              <label className="font-semibold text-lg text-gray-800">Change password</label>
              <input
                type="password"
                className="rounded-md bg-backgroundSecondary text-textSecondary px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all w-full mt-4"
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                className="rounded-md bg-backgroundSecondary text-textSecondary px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all w-full"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-sm text-textSecondary mt-2">
                Important: Create a strong and memorable password. We cannot assist with account recovery if your password is lost.
              </p>
            </div>
            <input
              type="password"
              className="rounded-md bg-backgroundSecondary text-textSecondary px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="submit" className="bg-primaryOrange mt-3 w-full p-2 text-white rounded-md hover:opacity-80 flex flex-row items-center justify-center space-x-2" disabled={loading}>
              {loading && (
                <ReloadIcon className="h-4 w-4 animate-spin" />
              )}
              <p className="text-xl font-semibold">Change password</p>
            </button>
          </form>
          <div className="mt-10">
            <h1 className="font-semibold text-lg text-gray-800">Danger zone</h1>
            <button type="submit" className="border border-primaryOrange mt-3 px-4 py-2 text-primaryOrange rounded-md hover:bg-primaryOrange hover:text-white transition-all" disabled={loading} onClick={() => {
              localStorage.removeItem("authToken")
              router.push("/login")
            }}>
              <p className="text-lg font-semibold">Logout</p>
            </button>
            <div className="mt-5">
                {/* Create a check box for auto logout on or off */}
                <p className="font-semibold">Automatically log out after 1 hour of inactivity</p>
                <div className="flex flex-row space-x-2 items-center mt-2">
                  <input type="checkbox" className="w-5 h-5 border border-borderPrimary rounded-md focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all text-primaryOrange" checked={autoLogout} onChange={(e) => {
                    setAutoLogout(e.target.checked)
                    localStorage.setItem("autoLogout", e.target.checked ? "1" : "0")
                  }}/>
                  <div>
                  <p className="text-textSecondary">Auto logout {
                    autoLogout? "enabled" : "disabled"
                  }</p>
                  <p className="
                  text-xs text-textSecondary
                  ">
                    Note: You need to login again to apply the changes
                  </p>
                  </div>
                  </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
