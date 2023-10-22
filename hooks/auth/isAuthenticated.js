import React, { useEffect, useState } from 'react'
import jwt from "jsonwebtoken"
import { useRouter } from 'next/router';
export default function IsAuthenticated() {
    const [loggedIn, setLoggedIn] = useState(false)
    const router = useRouter()

    useEffect(() => {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
            const decodedToken = jwt.verify(authToken, process.env.NEXT_PUBLIC_JWT_SECRET_KEY);
            // Check if the token is still valid
            if (decodedToken.exp * 1000 > Date.now()) {
                setLoggedIn(true);
              } else {
                // Token has expired, log the user out
                localStorage.removeItem('authToken');
                setLoggedIn(false);
                router.push("/login")
            }
        } catch (error) {
            // Token verification failed, log the user out
            console.error('Token verification failed:', error.message);
            localStorage.removeItem('authToken');
            setLoggedIn(false);
        }
    }else{
      router.push("/login")
    }
    }, [router])
}
