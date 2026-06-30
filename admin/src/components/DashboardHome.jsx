import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Package, ShoppingCart, Users, Loader2 } from 'lucide-react';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        sales: 0,
        products: 0,
        orders: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);
    const url = 'https://shop-2-ms77.onrender.com';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const config = { headers: { token } };

                const [productsRes, ordersRes, usersRes] = await Promise.all([
                    axios.get(`${url}/api/product/list`),
                    axios.get(`${url}/api/order/list`, config),
                    axios.get(`${url}/api/user/users`, config)
                ]);

                const productsData = productsRes.data.data || [];
                const ordersData = ordersRes.data.data || [];
                const usersData = usersRes.data.data || [];

                // Calculate total sales from paid orders
                const totalSales = ordersData
                    .filter(order => order.payment === true)
                    .reduce((sum, order) => sum + (order.amount || 0), 0);

                setStats({
                    sales: totalSales,
                    products: productsData.length,
                    orders: ordersData.length,
                    users: usersData.length
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);
    return (
        <section className='relative max-w-screen mx-auto p-4 w-full bg-[#f9f9f6] text-black py-16 px-6 sm:px-10 font-sans md:ml-20'>
            <div className='max-w-5xl mx-auto'>
                {/* HEADING */}
                <div className='border-b-[4px] border-black pb-6 mb-8'>
                    <h1 className='text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none'>
                        Welcome <br className="sm:hidden" /><span className="text-[#ff5500]">Admin</span>
                    </h1>
                    <p className='text-lg font-bold uppercase tracking-widest mt-4 text-black/60'>
                        Control Panel Overview
                    </p>
                </div>

                {/* STATS GRID */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>

                    <div className='bg-white border-[4px] border-black p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all'>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className='text-xl font-black uppercase tracking-tight'>Total Sales</h3>
                            <Activity className="w-8 h-8 text-[#ff5500]" strokeWidth={2.5} />
                        </div>
                        <p className='text-4xl font-black tracking-tighter'>
                            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : `${stats.sales.toFixed(2)}-EGP`}
                        </p>
                    </div>

                    <div className='bg-white border-[4px] border-black p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all'>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className='text-xl font-black uppercase tracking-tight'>Products</h3>
                            <Package className="w-8 h-8 text-black" strokeWidth={2.5} />
                        </div>
                        <p className='text-4xl font-black tracking-tighter'>
                            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.products}
                        </p>
                    </div>

                    <div className='bg-white border-[4px] border-black p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all'>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className='text-xl font-black uppercase tracking-tight'>Orders</h3>
                            <ShoppingCart className="w-8 h-8 text-black" strokeWidth={2.5} />
                        </div>
                        <p className='text-4xl font-black tracking-tighter'>
                            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.orders}
                        </p>
                    </div>

                    <div className='bg-white border-[4px] border-black p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all'>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className='text-xl font-black uppercase tracking-tight'>Users</h3>
                            <Users className="w-8 h-8 text-black" strokeWidth={2.5} />
                        </div>
                        <p className='text-4xl font-black tracking-tighter'>
                            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.users}
                        </p>
                    </div>

                </div>

                {/* BANNER */}
                <div className='bg-[#ff5500] border-[4px] border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center'>
                    <h2 className='text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white mb-4'>
                        System is Online
                    </h2>
                    <p className='text-gray-200 font-bold uppercase tracking-widest'>
                        Use the sidebar to manage your store.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default DashboardHome;
