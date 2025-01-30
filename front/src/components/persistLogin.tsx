import React, { useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';

// Services
import { verify, refresh } from '../services/authService';

// Interfaces
interface isLoggedInProps {
    isLoggedIn: boolean | undefined;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function PersistLogin({isLoggedIn, setIsLoggedIn} : isLoggedInProps) {

    const [loading, setLoading] = useState(true);
      
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const result = await verify();

                if(result?.status == 200) {
                    setIsLoggedIn(true);
                } else {
                    const refreshResult = await refresh();
                    if(refreshResult?.status == 200) {
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                    }
                }
            } catch (error: any) {
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        }
        
        checkAuthentication();
    }, [isLoggedIn])

    if (loading) {
        return "loading";
    }

    return <Outlet />;
}