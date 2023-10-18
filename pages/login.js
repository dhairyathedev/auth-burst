import React, { useState, useEffect } from 'react';
import { inter } from '@/styles/font';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import jwt from "jsonwebtoken"

export default function Login() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
            try {
                const decodedToken = jwt.verify(authToken, process.env.NEXT_PUBLIC_JWT_SECRET_KEY);
                // Check if the token is still valid
                if (decodedToken.exp * 1000 > Date.now()) {
                    setLoggedIn(true);
                    setUserId(decodedToken.userId); // Extracting user ID from the token
                } else {
                    // Token has expired, log the user out
                    localStorage.removeItem('authToken');
                    setLoggedIn(false);
                    setUserId(null);
                }
            } catch (error) {
                // Token verification failed, log the user out
                console.error('Token verification failed:', error.message);
                localStorage.removeItem('authToken');
                setLoggedIn(false);
                setUserId(null);
            }
        }
    }, []);

    async function createUser(e) {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter the email!');
        } else {
            try {
                const res = await axios.post('/api/user/login', {
                    email,
                    password,
                });

                // Check for success status
                if (res.status === 200) {
                    const { token } = res.data;
                    toast.success('You have logged in!');

                    // Store the token securely on the client side
                    localStorage.setItem('authToken', token);
                    setEmail('');
                    setPassword('');
                    setLoggedIn(true);
                } else {
                    // Handle other statuses
                    toast.error('Incorrect password or email!');
                }
            } catch (error) {
                // Handle errors
                if (error.response && error.response.status === 401) {
                    toast.error('Incorrect password or email!');
                } else if (error.response && error.response.status === 500) {
                    toast.error('User does not exist!');
                } else {
                    console.error('Unexpected error:', error);
                    toast.error('An unexpected error occurred');
                }
            }
        }
    }

    if (isLoggedIn) {
        // Redirect or render content for authenticated users
        return <p>You are logged in as user {userId}!</p>;
    }

    return (
        <>
            {/* NAVIGATION (Later to make a component) */}
            <Toaster />
            <div className="max-w-screen-xl mx-auto m-2 mt-8 p-4 sm:block flex items-center justify-center">
                <Image src="/logo.svg" width={210} height={51} alt="AuthBurst" />
            </div>
            {/* FORM */}
            <main className={`max-w-screen-sm mx-auto mt-10 ${inter.className}`}>
                <h2 className="text-4xl font-bold text-primaryOrange text-center">Welcome to AuthBurst</h2>
                <h4 className="text-textSecondary text-center text-2xl mt-4 font-light">Safe · Secure · Simple</h4>
                <h3 className="text-center text-xl mt-8 font-semibold">Enter the following details to get started</h3>
                <form className="flex flex-col space-y-8 mt-10 max-w-md mx-auto" onSubmit={(e) => createUser(e)} action="/">
                    <input type="email" placeholder="tiny@realemail.com" className="rounded-md bg-backgroundSecondary placeholder:text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all" onChange={(e) => setEmail(e.target.value)} required />
                    <div>
                        <input type="password" placeholder="*******************" className="rounded-md bg-backgroundSecondary placeholder:text-textSecondary placeholder:text-lg px-4 border border-borderPrimary focus:outline-none focus:ring-0 focus:border-primaryOrange focus:border-2 transition-all w-full" onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="bg-primaryOrange mt-3 w-full p-2 text-xl font-semibold text-white rounded-md hover:opacity-80">Login</button>
                </form>
            </main>
        </>
    );
}
