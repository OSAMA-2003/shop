import React from 'react'
import { useState, useEffect } from 'react'
import { Rocket, Menu, X } from "lucide-react";
import MenuItems from './MenuItems';
import logo from '../assets/logo.png'



const Navbar = () => {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setSideBarOpen(false)
            }
        }
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    return (
        <>
            <header className='hidden md:flex items-center px-8 py-3 fixed top-6 left-1/2 -translate-x-1/2 w-[96%] 
                    bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg rounded-full z-50 transition-all'>
                <div className='items-center gap-4 lg:flex hidden'>
                    <img src={logo} width={60} />
                </div>
                <div className='flex-1 flex justify-center lg:justify-end'>
                    <MenuItems isMobile={false} />
                </div>
            </header>
            <header className='md:hidden flex justify-between items-center px-6 py-3
                               fixed top-4 left-4 right-4 bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg rounded-full z-50 transition-all'>
                <div className='flex items-center gap-2 '>
                     <img src={logo} width={60} />
                     </div>
                <button onClick={() => setSideBarOpen(true)} className='text-text-main p-2 rounded-lg hover:bg-surface transition-colors'>
                    <Menu className=' w-8 h-8 cursor-pointer' />
                </button>
            </header>

            {/* Sidebar Mobile */}
            <aside className={`fixed top-0 right-0 h-full w-72 bg-background border-l border-border-light shadow-2xl transform transition-transform duration-500 z-[60]
                     ${sidebarOpen ? "translate-x-0" : "translate-x-full "}`}>
                <div className='flex justify-end p-4'>
                    <button onClick={() => setSideBarOpen(false)} className='text-text-main p-3 hover:bg-surface rounded-lg transition-all duration-300'>
                        <X className='w-7 h-7' />
                    </button>
                </div>
                <div className='mt-10 px-6 space-y-6'>
                    <MenuItems setSideBarOpen={setSideBarOpen} isMobile={true} />
                    
                </div>
            </aside>

            {
                sidebarOpen && (
                    <div className='sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]'
                        onClick={() => setSideBarOpen(false)}>

                    </div>
                )
            }


        </>
    )
}

export default Navbar;