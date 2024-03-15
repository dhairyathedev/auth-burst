import encrypt from '@/hooks/auth/encrypt';
import { selectValues } from '@/lib/totp-values';
import { ReloadIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

export default function DeleteId() {
    const router = useRouter()
    const [allowed, setAllowed] = useState(null)
    const [accountName, setAccountName] = useState(null)
    const [accountService, setAccountService] = useState(null)
    const [uid, setUid] = useState(null)
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [salt, setSalt] = useState(null)
    const [encryptedPassword, setEncryptedPassword] = useState(null)
    const { id } = router.query;

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const userRes = await axios.post('/api/user/fetch', {
                    token: localStorage.getItem('authToken'),
                });
                if (userRes.status === 200) {
                    const res = await axios.post("/api/totp/get", {
                        tid:id,
                        token: localStorage.getItem('authToken'),
                    });
                    if (res.status === 200) {
                        setAllowed(true)
                        setAccountName(res.data.data.account_name)
                        setEncryptedPassword(userRes.data.data[0].password)
                        setSalt(userRes.data.data[0].salt)
                        setUid(userRes.data.data[0].uid)
                        setAccountService(selectValues[res.data.data.account_service])
                    } else {
                        setAllowed(false)
                    }
                }
            } catch (error) {
                console.error(error);
                setAllowed(false);
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [id])

    async function handleDelete() {
        try {
            setLoading(true);
            const res = await axios.post("/api/totp/delete", {
                tid: id,
                uid
            });
            if (res.status === 200) {
                toast.success("Token deleted successfully!")
                router.push("/app")
            } else {
                toast.error("Failed to delete the token!")
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete the token!")
        } finally {
            setLoading(false);
        }
    }

    async function validatePassword(e) {
        e.preventDefault();
        const { password: inputHash } = encrypt(password, salt);
        if (inputHash === encryptedPassword) {
            await handleDelete()
        } else {
            toast.error("Invalid password!")
        }
    }

    if (loading) {
        return <div className="flex flex-col justify-center items-center min-h-screen">
            <ReloadIcon className="h-6 w-6 animate-spin text-textSecondary" />
            <p className="text-textSecondary mt-4">Hang tight! Processing the page!</p>
        </div>;
    }

    if (allowed && loading === false) {
        return (
            <>
                <Toaster />
                <div className="flex flex-col space-y-4 justify-center items-center min-h-screen">
                    <div className="bg-primaryOrange w-[52px] h-[52px] rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 12v-9"></path>
                            <path d="M12 12l-9 -2.5"></path>
                            <path d="M12 12l9 -2.5"></path>
                            <path d="M12 12l6 8.5"></path>
                            <path d="M12 12l-6 8.5"></path>
                        </svg>
                    </div>
                    <h1 className="text-xl font-semibold">
                        {
                            accountName + "(" + accountService + ")"
                        }

                    </h1>
                    <div>
                        <p className="text-textSecondary">Are you sure you want to delete this token? </p>
                        <p className="text-primaryOrange text-center">
                            Note: This action is irreversible!
                        </p>
                    </div>
                    <form className="flex flex-col space-y-4" onSubmit={validatePassword}>
                        <input type="password" placeholder="Enter your password" className="w-80 rounded-md bg-backgroundSecondary placeholder:text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <div className="flex flex-row space-x-4">
                        <Link href="/app" className="bg-borderPrimary mt-3 w-full p-2 text-white rounded-md hover:opacity-80 flex flex-row items-center justify-center space-x-2">
                            {loading && (
                                <ReloadIcon className="h-4 w-4 animate-spin" />
                            )}
                            <p className="text-xl font-semibold">Cancel</p>
                        </Link>
                        <button type="submit" className="bg-primaryOrange mt-3 w-full p-2 text-white rounded-md hover:opacity-80 flex flex-row items-center justify-center space-x-2" disabled={loading}>
                            {loading && (
                                <ReloadIcon className="h-4 w-4 animate-spin" />
                            )}
                            <p className="text-xl font-semibold">Delete Token</p>
                        </button>
                        </div>
                    </form>


                </div>
            </>
        )
    } else {
        return (
            <>
                <div>
                    <h1>Not authorized</h1>
                </div>
            </>
        )
    }
}
