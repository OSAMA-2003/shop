import React, { useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Home, FolderOpen, ShoppingBag, Mail, ShoppingCart, User, Shirt } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import { ShopContext } from '../context/ShopContenxt';
import { useTranslation } from 'react-i18next';

export const menuItemsData = [
    { to: "home", labelKey: "nav.home", Icon: Home },
    { to: "/collection", labelKey: "nav.collection", Icon: FolderOpen, isPage: true },
    { to: "/mockups", labelKey: "nav.mockups", Icon: Shirt, isPage: true },
    { to: "contact", labelKey: "nav.contact", Icon: Mail },
];

const MenuItems = ({ setSideBarOpen, isMobile }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, token, userData } = useContext(ShopContext);

    const totalItems = Object.values(cartItems || {}).reduce((a, b) => a + b, 0);

    return (
        <div className={`flex md:justify-center lg:justify-end ${isMobile ? "flex-col space-y-4 items-start pt-4" : "flex-row w-full items-center gap-2 lg:gap-4"}`}>

            {/* NAVIGATION LINKS */}
            {menuItemsData.map(({ to, labelKey, Icon, isPage }) =>
                isPage ? (
                    <button
                        key={to}
                        onClick={() => {
                            navigate(to);
                            if (setSideBarOpen) setSideBarOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all shrink-0 w-full md:w-auto text-gray-600 hover:bg-white/50 hover:text-[#ff5500] cursor-pointer"
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold text-base">{t(labelKey)}</span>
                    </button>
                ) : location.pathname === "/" ? (
                    <ScrollLink
                        key={to}
                        to={to}
                        smooth={true}
                        duration={500}
                        offset={-80}
                        spy={true}
                        onClick={() => setSideBarOpen && setSideBarOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all shrink-0 w-full md:w-auto text-gray-600 hover:bg-white/50 hover:text-[#ff5500] cursor-pointer"
                        activeClass="bg-white !text-[#ff5500] shadow-sm border border-white/50 font-bold"
                    >
                        <Icon className="w-5 h-5" />
                        <span className='font-semibold text-base'>{t(labelKey)}</span>
                    </ScrollLink>
                ) : (
                    <button
                        key={to}
                        onClick={() => {
                            navigate("/");
                            if (setSideBarOpen) setSideBarOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all shrink-0 w-full md:w-auto text-gray-600 hover:bg-white/50 hover:text-[#ff5500] cursor-pointer"
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold text-base">{t(labelKey)}</span>
                    </button>
                )
            )}

            {/* DIVIDER FOR MOBILE */}
            {isMobile && <div className="w-full border-t border-gray-200 my-2"></div>}

            {/* DESKTOP CART ICON (Hidden on Mobile Sidebar) */}
            {!isMobile && (
                <button
                    onClick={() => {
                        navigate("/cart");
                        if (setSideBarOpen) setSideBarOpen(false);
                    }}
                    className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-gray-600 hover:bg-white/50 hover:text-[#ff5500] cursor-pointer"
                >
                    <ShoppingCart className='w-5 h-5' />
                    {totalItems > 0 && (
                        <span className='absolute top-0 right-1 w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center shadow-sm'>
                            {totalItems}
                        </span>
                    )}
                </button>
            )}

            {!token ? (
                <button
                    onClick={() => {
                        navigate("/login");
                        if (setSideBarOpen) setSideBarOpen(false);
                    }}
                    className='bg-[#ff5500] px-4 py-2 font-bold text-lg uppercase text-white hover:bg-black hover:text-[#ff5500] transition-colors rounded-xl cursor-pointer'
                >
                    {t('nav.login')}
                </button>
            ) : (
                <div className={`flex ${isMobile ? 'flex-col w-full gap-2' : 'items-center gap-2'}`}>
                    <button
                        onClick={() => { navigate("/profile"); if (setSideBarOpen) setSideBarOpen(false); }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-white/50 hover:text-[#ff5500] transition-colors cursor-pointer ${isMobile ? "w-full" : ""}`}
                    >
                        {userData?.pic ? (
                            <img src={userData.pic} alt="Profile" className='w-7 h-7 rounded-full border-[2px] border-black object-cover shadow-sm' />
                        ) : (
                            <User className='w-5 h-5' />
                        )}
                        <span className="font-semibold text-base">{isMobile ? (userData?.name || t('nav.profile')) : t('nav.profile')}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuItems;