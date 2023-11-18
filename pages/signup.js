import React, { useState } from 'react'
import { inter } from '@/styles/font'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from 'next/router';


export default function SignUp() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    async function createUser(e) {
        e.preventDefault();
        if (password.length < 6) {
            toast.error("Password must be greater than 6 characters!");
        } else if(!email){
            toast.error("Please enter the email!")
        }else if (password === confirmPassword) {
            setLoading(true)
            const res = await axios.post("/api/user/signup", {
                email,
                password,
            })
            if (res.status === 200 && res.data.success) {
                toast.success("You have signed up!");
                setEmail("")
                setPassword("")
                setConfirmPassword("")
                router.push("/login")
            }
        } else {
            toast.error("Passwords don't match");
        }
        setLoading(false)
    }
    return (
        <>
            {/* NAVIGATION (Later to make a componennt) */}
            <Toaster />
            <div className="max-w-screen-xl mx-auto m-2 mt-8 p-4 sm:block flex items-center justify-center">
                <Image src="/logo.svg" width={210} height={51} alt="AuthBurst" />
            </div>
            {/* FORM */}
            <main className={`max-w-screen-sm mx-auto mt-10 ${inter.className} m-2 p-4`}>
                <h2 className="text-4xl font-bold text-primaryOrange text-center">Welcome to AuthBurst</h2>
                <h4 className="text-textSecondary text-center text-2xl mt-4 font-light">Safe · Secure · Simple</h4>
                <h3 className="text-center text-xl mt-8 font-semibold">Enter the following details to get started</h3>
                <form className="flex flex-col space-y-8 mt-10 max-w-md mx-auto" onSubmit={(e) => createUser(e)} action="/">
                    <input type="email" placeholder="tiny@realemail.com" className="rounded-md bg-backgroundSecondary placeholder:text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all" onChange={(e) => setEmail(e.target.value)} required />
                    <div>
                        <input type="password" placeholder="*******************" className="rounded-md bg-backgroundSecondary placeholder:text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all w-full mb-2" onChange={(e) => setPassword(e.target.value)} required />
                        <p className="text-sm text-textSecondary">
                            Important: Create a strong and memorable password. We cannot assist with account recovery if your password is lost.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium mb-4">
                            Confirm your password!
                        </h4>
                        <input type="password" placeholder="*******************" className="rounded-md bg-backgroundSecondary placeholder:text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all w-full mb-2" onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <div>
                        <p className="text-textSecondary text-sm">By signing up, you comply with <a href="/terms" className="text-primaryOrange underline">Terms and conditions.</a></p>
                        <button type="submit" className="bg-primaryOrange mt-3 w-full p-2 text-white rounded-md hover:opacity-80 flex flex-row items-center justify-center space-x-2" disabled={loading}>
                        {loading && (
                            <ReloadIcon className="h-4 w-4 animate-spin" />
                        )}
                        <p className="text-xl font-semibold">Signup</p>
                    </button>
                    </div>
                </form>
            </main>
        </>
    )
}
