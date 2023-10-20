import { decodeTOTPToken } from '@/hooks/auth/encrypt';
import IsAuthenticated from '@/hooks/auth/isAuthenticated'
import { getCurrentSeconds } from '@/lib/time';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
const totp = require("totp-generator")

export default function App() {
    const [totpTokens, setTotpTokens] = useState([])
    const [updatingIn, setUpdatingIn] = useState("")
    useEffect(() => {
        setInterval(() => {
        setUpdatingIn(30-(getCurrentSeconds() % 30))
        })
    }, [])
    useEffect(() => {
        // Initial data fetch
        const fetchData = async () => {
            try {
                const userRes = await axios.post('/api/user/fetch', {
                    token: localStorage.getItem('authToken'),
                });

                const userDetails = userRes.data.data[0];

                if (userDetails.uid) {
                    const totpRes = await axios.post('/api/totp/fetch', {
                        token: localStorage.getItem('authToken'),
                    });

                    const decodedTokens = totpRes.data.data.map((item) => {
                        return decodeTOTPToken(item.token, userDetails.password, userDetails.uid);
                    });

                    setTotpTokens(decodedTokens);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    
    IsAuthenticated();
    return (
        <>
            <div className="max-w-screen-xl mx-auto m-2 mt-8 p-4 ">
                <Image src="/logo.svg" width={210} height={51} alt="AuthBurst" />
                <div className="flex flex-row items-center space-x-2 mt-10">
                    <input type="text" placeholder="Search accounts" className="rounded-md bg-backgroundSecondary placeholder:text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all w-11/12" />
                    <Link href="/app/create" className="bg-primaryOrange w-1/12 p-2 text-xl font-semibold text-white flex justify-center items-center rounded-md hover:opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 5l0 14"></path>
                            <path d="M5 12l14 0"></path>
                        </svg>
                    </Link>
                </div>
                Updating in: {updatingIn}
                {totpTokens.map((item, index) => (
                    <p key={index}>{totp(item)}</p>
                ))}

            </div>
        </>
    )
}
