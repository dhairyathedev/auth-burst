import IsAuthenticated from '@/hooks/auth/isAuthenticated'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default function App() {
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
            </div>
        </>
    )
}
