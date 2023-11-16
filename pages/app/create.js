import IsAuthenticated from '@/hooks/auth/isAuthenticated'
import { inter } from '@/styles/font'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { ReloadIcon } from '@radix-ui/react-icons'
export default function Create() {
    const [accountName, setAccountName] = useState("")
    const [accountService, setAccountService] = useState(0)
    const [totpToken, setTotpToken] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter("")
    IsAuthenticated();


    async function handler(e) {
        e.preventDefault();
        try {
            const userResponse = await fetchUserData();
            handleUserResponse(userResponse);
        } catch (error) {
            toast.error("An error occurred while fetching user data.");
            console.error("Error fetching user data:", error);
        }
    }
    
    async function fetchUserData() {
        return await axios.post("/api/user/fetch", {
            token: localStorage.getItem('authToken')
        });
    }
    
    async function handleUserResponse(userResponse) {
        if (userResponse.data.success) {
            const userData = userResponse.data.data[0];
            const { uid, password } = userData;
            
            try {
                const totpResponse = await addTOTP(uid, password);
                handleTOTPResponse(totpResponse);
            } catch (error) {
                toast.error("Failed to create the token!");
                console.error("Error adding TOTP:", error);
            }
        } else {
            toast.error("Unauthorized!");
            router.push("/login");
        }
    }
    
    async function addTOTP(uid, password) {
        setLoading(true);
        return await axios.post("/api/totp/add", {
            uid,
            password,
            account_name: accountName,
            account_service: accountService,
            token: totpToken,
            digits: 6
        }).then((res) => {
            setLoading(false);
            return res;
        });
    }
    
    function handleTOTPResponse(totpResponse) {
        if (totpResponse.data.success) {
            toast.success("Token Added!");
            router.push("/app");
        } else {
            toast.error("Failed to create the token!");
        }
    }
    return (
        <>
            <Toaster />
            <div className="max-w-screen-xl mx-auto m-2 mt-8 p-4 sm:block flex items-center justify-center">
                <Image src="/logo.svg" width={210} height={51} alt="AuthBurst" />
            </div>
            <main className={`max-w-screen-sm mx-auto ${inter.className} px-4`}>
                <h2 className="text-4xl font-bold text-primaryOrange text-center">Add 2FA Account</h2>
                <form className="flex flex-col space-y-4 mt-10 max-w-md mx-auto" onSubmit={(e) => handler(e)} action="/">
                    <h4 className="text-textSecondary text-justify text-base sm:text-lg font-light">AuthBurst facilitates the addition of Authenticator accounts, including those from platforms like Gmail, Facebook, Dropbox, and numerous others. While QR code scanning is currently unavailable, you can seamlessly add accounts by entering the provided code from the service where you wish to enable two-factor authentication (2FA).</h4>
                    <label className="font-semibold">Enter account name</label>
                    <input type="text" placeholder="eg. Twitter Username" className="rounded-md bg-backgroundSecondary placeholder:text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
                    <label className="font-semibold">Choose service name</label>
                    <select className="rounded-md bg-backgroundSecondary text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all" value={accountService} onChange={(e) => setAccountService(e.target.value)} required>
                        <option value={0} defaultValue={true}>Select serivce</option>
                        <option value={1}>Amazon Web Services</option>
                        <option value={2}>Amazon</option>
                        <option value={3}>DigitalOcean</option>
                        <option value={4}>Discord</option>
                        <option value={5}>Dropbox</option>
                        <option value={6}>Evernote</option>
                        <option value={7}>Facebook</option>
                        <option value={8}>GitHub</option>
                        <option value={9}>Google</option>
                        <option value={10}>Heroku</option>
                        <option value={11}>IFTTT</option>
                        <option value={12}>Linode</option>
                        <option value={13}>Microsoft</option>
                        <option value={14}>Slack</option>
                        <option value={15}>Snapchat</option>
                        <option value={16}>Stripe</option>
                        <option value={17}>TeamViewer</option>
                        <option value={18}>Twitter (X)</option>
                        <option value={19}>WordPress</option>
                        <option value={20}>Zoom</option>
                        <option value={21}>Other</option>
                    </select>
                    <label className="font-semibold">Enter the code given by the website.</label>
                    <input type="text" placeholder="eg. JBSWY3DPEHPK3PXP" className="rounded-md bg-backgroundSecondary placeholder:text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all" value={totpToken} onChange={(e) => setTotpToken(e.target.value)} required />
                    <button type="submit" className="bg-primaryOrange mt-3 w-full p-2 text-white rounded-md hover:opacity-80 flex flex-row items-center justify-center space-x-2" disabled={loading}>
                        {loading && (
                            <ReloadIcon className="h-4 w-4 animate-spin" />
                        )}
                        <p className="text-xl font-semibold">Add Account</p>
                    </button>
                </form>
            </main>
        </>
    )
}
