import React from 'react';

const Navbar = () => {
    return (
        <div className ='h-20 w-full border-b-2 flex items-center justify-between'>
            <ul className='flex'>
                <li className='p-4 cursor-pointer hover:text-slate-500'>Pantry</li>
            </ul>
            <ul className='flex'>
                <li className='p-4 cursor-pointer hover:text-slate-500'>Login</li>
                <li className='p-4 cursor-pointer hover:text-slate-500'>Sign Up</li>
            </ul>
        </div>

    )
}

export default Navbar;