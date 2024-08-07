"use client";
import React, {useState, useEffect} from 'react';
import { UserAuth } from '../context/AuthContext'

const Navbar = () => {
    const {user, googleSignIn, logOut} = UserAuth();
    const [loading, setLoading] = useState(true);

    const handleSignIn = async () => {
        try {
            await googleSignIn()
        } catch {
            console.log("error");
        }
    }

    const handleSignOut = async () => {
        try{
            await logOut()
        } catch {
            console.log("error")
        }
    }

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setLoading(false)
        }
        checkAuthentication();
    }, [user])

    return (
        <div className ='h-20 w-full border-b-2 flex items-center justify-between'>

            <ul className='flex'>
                    <li className='p-4 cursor-pointer'>Pantry</li>
            </ul>

            {loading ? null : !user ? (
                <ul className='flex'>
                    <li onClick={handleSignIn} className='p-4 cursor-pointer hover:text-slate-500'>Login</li>
                    <li onClick={handleSignIn} className='p-4 cursor-pointer hover:text-slate-500'>Sign Up</li>
                </ul>
            ) : (
                <ul className='flex'>
                    <li className='p-4 cursor-pointer'>Welcome, {user.displayName}</li>
                    <li onClick={handleSignOut} className='p-4 cursor-pointer hover:text-slate-500'>Sign Out</li>
                </ul>
            )}
        </div>

    )
}

export default Navbar;