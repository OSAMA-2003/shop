import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { PlusCircle, List, ClipboardCheck, Menu, X, LogOut, Users, Bell } from "lucide-react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const menuItems = [
        { to: '/admin/add', label: 'Add Product', Icon: PlusCircle },
        { to: '/admin/mockups', label: 'Add Mockup', Icon: PlusCircle },
        { to: '/admin/list', label: 'Products List', Icon: List },
        { to: '/admin/orders', label: 'Customer Orders', Icon: ClipboardCheck },
        { to: '/admin/user', label: 'Users', Icon: Users },
        { to: '/admin/notifications', label: "Notifications", Icon: Bell }
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <>
            {/* MOBILE TOGGLE BUTTON */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className='md:hidden fixed top-4 left-4 z-50 bg-[#ff5500] border-[3px] border-black p-2 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] transition-all focus:outline-none rounded-none'
            >
                {isOpen ? <X className='w-6 h-6' strokeWidth={3} /> : <Menu className='w-6 h-6' strokeWidth={3} />}
            </button>

            {/* SIDEBAR */}
            <aside 
                className={`fixed top-0 left-0 h-full w-64 bg-[#f9f9f6] text-black border-r-[4px] border-black z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className='flex flex-col h-full justify-between py-10 px-6'>
                    
                    <div className='space-y-4'>
                        {/* HEADER */}
                        <div className='border-b-[4px] border-black pb-6 mb-8'>
                            <h2 className='text-4xl font-black uppercase tracking-tighter leading-none'>
                                Admin<br/>Panel
                            </h2>
                        </div>

                        {/* NAVIGATION LINKS */}
                        <div className='flex flex-col gap-3'>
                            {menuItems.map(({ to, label, Icon }) => (
                                <NavLink 
                                    key={to} 
                                    to={to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 px-4 py-3 border-[3px] transition-all font-black uppercase tracking-tight text-sm ${
                                            isActive
                                                ? 'bg-[#ff5500] border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                                                : 'border-transparent text-black hover:border-black hover:bg-black/5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                        }`
                                    }
                                >
                                    <Icon className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* LOGOUT BUTTON */}
                    <button 
                        onClick={handleLogout} 
                        className='flex items-center gap-3 justify-center mt-6 w-full px-4 py-4 bg-black text-[#ff5500] border-[3px] border-black font-black uppercase tracking-widest hover:bg-[#ff5500] hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
                    >
                        <LogOut className='w-5 h-5' strokeWidth={3} />
                        <span>Logout</span>
                    </button>

                </div>
            </aside>

            {/* DARK BACKDROP FOR MOBILE */}
            {isOpen && (
                <div 
                    className='md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-30'
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
}

export default Sidebar;