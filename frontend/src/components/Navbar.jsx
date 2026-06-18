import React, { useState, useEffect, useContext, useRef } from 'react';
import { Menu, X, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuItems from './MenuItems';
import logo from '../assets/logo.png';
import { ShopContext } from '../context/ShopContenxt';

const Navbar = () => {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const navigate = useNavigate();
    
    // Bring context into the Navbar to show the cart count on the mobile header
    const { cartItems } = useContext(ShopContext);
    const totalItems = Object.values(cartItems || {}).reduce((a, b) => a + b, 0);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSideBarOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Track scroll direction to hide/show navbar
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // Hide navbar if scrolling down and passed the 100px threshold
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* DESKTOP HEADER (Floating & Rounded) */}
            <header className={`hidden md:flex items-center px-8 py-2.5 fixed top-6 left-1/2 -translate-x-1/2 w-[96%] max-w-7xl bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl rounded-full z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-32'}`}>
                <div className='items-center gap-4 flex shrink-0'>
                    <img 
                        src={logo} 
                        alt="Logo" 
                        className="w-[50px] object-contain cursor-pointer" 
                        onClick={() => navigate('/')} 
                    />
                </div>
                <div className='flex-1 flex justify-end'>
                    <MenuItems isMobile={false} />
                </div>
            </header>

            {/* MOBILE HEADER (Floating & Rounded with Cart) */}
            <header className={`md:hidden flex justify-between items-center px-6 py-3 fixed top-4 left-4 right-4 bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl rounded-full z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-32'}`}>
                <div className='flex items-center'>
                    <img 
                        src={logo} 
                        alt="Logo" 
                        className="w-[45px] object-contain cursor-pointer" 
                        onClick={() => navigate('/')} 
                    />
                </div>
                
                {/* Right side: Cart and Hamburger Menu */}
                <div className='flex items-center gap-5'>
                    {/* Mobile Cart Icon */}
                    <button 
                        onClick={() => navigate('/cart')} 
                        className="relative text-gray-700 hover:text-[#ff5500] transition-colors"
                    >
                        <ShoppingCart className='w-6 h-6' />
                        {totalItems > 0 && (
                            <span className='absolute -top-1.5 -right-2 w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center shadow-sm'>
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* Hamburger Menu Toggle */}
                    <button 
                        onClick={() => setSideBarOpen(true)} 
                        className='text-gray-700 p-1.5 rounded-full hover:bg-white/50 transition-colors'
                    >
                        <Menu className='w-7 h-7' />
                    </button>
                </div>
            </header>

            {/* MOBILE SIDEBAR */}
            <aside className={`fixed top-0 right-0 h-full w-72 bg-[#f8fafc] border-l border-white/50 shadow-2xl transform transition-transform duration-500 z-[70] flex flex-col ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className='flex justify-end p-5'>
                    <button 
                        onClick={() => setSideBarOpen(false)} 
                        className='text-gray-500 p-2 hover:bg-gray-200 rounded-full transition-all duration-300'
                    >
                        <X className='w-7 h-7' />
                    </button>
                </div>
                
                <div className='mt-2 px-6 flex-1 overflow-y-auto pb-8'>
                    <MenuItems setSideBarOpen={setSideBarOpen} isMobile={true} />
                </div>
            </aside>

            {/* Dark Backdrop for Mobile Sidebar */}
            {sidebarOpen && (
                <div 
                    className='md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]'
                    onClick={() => setSideBarOpen(false)}
                ></div>
            )}
        </>
    );
}

export default Navbar;