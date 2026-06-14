import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { Home, FolderOpen, ShoppingBag, Mail, ShoppingCart, User, Shirt } from "lucide-react";
import { useState, useContext } from 'react';
import { Link as ScrollLink } from "react-scroll";
import { ShopContext } from '../context/ShopContenxt';


export const menuItemsData = [
    { to: "home", label: "Home", Icon: Home },
    { to: "categories", label: "Categories", Icon: FolderOpen },
    { to: "mockups", label: "Mockups", Icon:Shirt },

    { to: "shop", label: "Shop", Icon: ShoppingBag },
    { to: "contact", label: "Contact", Icon: Mail },
];
const MenuItems = ({ setSideBarOPen, isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { cartItems, token, setToken } = useContext(ShopContext)

    const totalItems = Object.values(cartItems).reduce((a, b) => a + b, 0);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(false);
        navigate("/");
        setSideBarOPen && setSideBarOPen(false);
    };


    return (
        <div
            className={`flex md:justify-center lg:justify-end ${isMobile
                    ? "flex-col space-y-6 items-center px-4 gap-y-2"
                    : "flex-row w-full items-center gap-4"
                }`}
        >
            {
                menuItemsData.map(({ to, label, Icon }) =>
                    location.pathname === "/" ? (
                        <ScrollLink
                            key={to}
                            to={to}
                            smooth={true}
                            duration={500}
                            offset={-80}
                            spy={true}
                            onClick={() => setSideBarOPen && setSideBarOPen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg h-[35px] transition-all shrink-0 w-auto min-w-[80px] text-text-muted hover:bg-surface hover:text-primary cursor-pointer"
                            activeClass="bg-surface text-primary shadow-sm border border-border-light font-bold"
                        >
                            <Icon className="w-5 h-5" />
                            <span className='font-semibold text-base'>{label}</span>
                        </ScrollLink>
                    ) : (
                        <button
                            key={to}
                            onClick={() => {
                                navigate("/");
                                setSideBarOPen && setSideBarOPen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg h-[35px] transition-all 
      shrink-0 w-auto min-w-[80px] text-text-muted hover:bg-surface hover:text-primary"
                        >
                            <Icon className="w-6 h-6" />
                            <span className="font-semibold text-base">{label}</span>
                        </button>
                    ) 
                )
            }
            <button onClick={() => {
                navigate("/cart")
                setSideBarOPen && setSideBarOPen(false)
            }}
                className=" relative flex items-center gap-3 px-4 py-3 rounded-lg h-[35px] transition-all 
                     text-text-muted hover:bg-surface hover:text-primary" >
                <ShoppingCart className='w-6 h-6' />
                {
                    totalItems > 0 && (
                        <span className='absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white
                                             bg-red-500 rounded-full flex items-center justify-center'>
                                               {totalItems}
                        </span>
                    )
                }
            </button>
            {!token ? (
                <button
                    onClick={() => {
                        navigate("/login");
                        setSideBarOPen && setSideBarOPen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg h-[35px]
                                 bg-primary text-white font-semibold hover:bg-[#d94f15] shadow-soft hover:shadow-md transition-all" >
                    Login
                </button>
            ) : (
                <div className='flex items-center gap-4'>
                    <button onClick={() => { navigate("/profile"); setSideBarOPen && setSideBarOPen(false); }} className="text-text-muted hover:text-primary transition-colors" title="My Profile">
                        <User className='w-6 h-6' />
                    </button>
                    <button onClick={handleLogout}
                        className='flex items-center gap-2 px-4 py-3 rounded-lg
      h-[35px] bg-surface border border-border-light text-text-main font-semibold hover:bg-gray-200 transition-all shadow-sm'>
                        Log Out
                    </button>

                </div>
            )}
        </div>
    );
};

export default MenuItems;