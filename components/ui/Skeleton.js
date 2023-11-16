import React from 'react'

export default function Skeleton() {
    return (
        <div className="flex flex-row justify-between items-center my-4 w-full">
            <div className="flex flex-row space-x-2 items-center">
                <div className="bg-primaryOrange w-[52px] h-[52px] rounded-md flex items-center justify-center opacity-30 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 12v-9"></path>
                        <path d="M12 12l-9 -2.5"></path>
                        <path d="M12 12l9 -2.5"></path>
                        <path d="M12 12l6 8.5"></path>
                        <path d="M12 12l-6 8.5"></path>
                    </svg>
                </div>
                <div>
                    <div className="w-96 h-4 bg-gray-300 opacity-30 animate-pulse" />
                    <div className="w-48 h-4 bg-gray-300 opacity-30 animate-pulse mt-4" />
                </div>
            </div>
            <div className="bg-gray-100 w-[52px] h-[52px] rounded-full flex items-center justify-center font-bold text-xl animate-pulse" />
        </div>
    )
}
