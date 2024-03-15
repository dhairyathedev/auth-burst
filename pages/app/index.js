import React, { useEffect, useState } from 'react';
import { decodeTOTPToken } from '@/hooks/auth/encrypt';
import IsAuthenticated from '@/hooks/auth/isAuthenticated';
import { getCurrentSeconds } from '@/lib/time';
import { selectValues } from '@/lib/totp-values';
import { inter, poppins } from '@/styles/font';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { CopyIcon, GearIcon, ReloadIcon, TrashIcon } from '@radix-ui/react-icons';
import Skeleton from '@/components/ui/Skeleton';
import toast, { Toaster } from 'react-hot-toast';
const totp = require('totp-generator');


export default function App() {
  const [totpTokens, setTotpTokens] = useState([]);
  const [totpValues, setTotpValues] = useState([]);
  const [updatingIn, setUpdatingIn] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUpdatingIn(30 - (getCurrentSeconds() % 30));
    }, 1000);

    return () => {
      clearInterval(intervalId); // Cleanup the interval
    };
  }, []);

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        setLoading(true);
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
          if (decodedTokens.length > 0) {
            setTotpValues(decodedTokens);
            setTotpTokens(totpRes.data.data);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  IsAuthenticated();

  // Filter the totpTokens based on the search query
  const filteredTokens = totpTokens.filter((item) =>
    item.account_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
    <Toaster />
      <div className={`max-w-screen-md mx-auto m-2 mt-8 p-4 ${inter.className}`}>
        <div className="flex justify-between items-center">
          <Image src="/logo.svg" width={210} height={51} alt="AuthBurst" />
          <Link href={"/app/settings"}>
            <GearIcon className="w-8 h-8 text-textSecondary hover:text-primaryOrange"/>
          </Link>
        </div>
        <div className="flex flex-row items-center space-x-2 mt-10">
          <input
            type="text"
            placeholder="Search accounts"
            className="rounded-md bg-backgroundSecondary placeholder:text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all w-11/12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link
            href="/app/create"
            className="bg-primaryOrange w-1/12 p-2 text-xl font-semibold text-white flex justify-center items-center rounded-md hover:opacity-80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 5l0 14"></path>
              <path d="M5 12l14 0"></path>
            </svg>
          </Link>
        </div>
        {
          loading && (
            <div className="flex flex-col justify-center items-center mt-10">
              <Skeleton />
              <Skeleton />
            </div>
          )
        }
        {
          filteredTokens.length === 0 && !loading && (
            <div className="flex flex-col justify-center items-center mt-20">
              <p className="text-textSecondary mt-4">No Token Accounts found!</p>
            </div>
          )
        }
        {filteredTokens.map((item, index) => (
          <div key={index} className="mx-auto mt-10">
            <div className="flex flex-row justify-between items-center my-4 w-full">
              <div className="flex flex-row space-x-2 items-center">
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
                <div>
                  <div className="flex flex-row space-x-4">
                    <h3 className={`${poppins.className} tracking-wider text-2xl`}>{totp(totpValues[index])}</h3>
                    <div className="flex flex-row space-x-2 items-center">
                      <button onClick={() => {
                        navigator.clipboard.writeText(totp(totpValues[index]));
                        toast.success('Copied to clipboard!');
                      }}>
                        <CopyIcon className="w-4 h-4 text-textSecondary hover:text-green-500"/>
                      </button>
                      <Link href={`/app/delete/${item.tid}`}>
                        <TrashIcon className="w-4 h-4 text-textSecondary hover:text-red-500"/>
                        </Link>
                    </div>
                  </div>
                  <p className="text-sm text-textSecondary">{selectValues[item.account_service]}{" (" + item.account_name + ")"}</p>
                </div>
              </div>
              <div className="bg-gray-100 w-[52px] h-[52px] rounded-full flex items-center justify-center font-bold text-xl">
                {updatingIn}
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}
