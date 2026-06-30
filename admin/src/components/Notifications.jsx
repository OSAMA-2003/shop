import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCheck, X } from "lucide-react";

function Notifications() {
    const url = 'https://shop-2-ms77.onrender.com';
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${url}/api/notifications/list`);
            const fetchedData = res.data.data || [];
            fetchedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNotifications(fetchedData);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`${url}/api/notifications/delete/${id}`);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const clearAll = async () => {
        if (!window.confirm("Are you sure you want to clear all notifications?")) return;
        try {
            await axios.delete(`${url}/api/notifications/clear`);
            setNotifications([]);
        } catch (err) {
            console.log(err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`${url}/api/notifications/read/${id}`);
            setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) {
        return (
            <section className='min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black  font-sans'>
                <div className='bg-white border-[4px] border-black p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                    <h2 className='text-2xl sm:text-3xl font-black uppercase tracking-widest animate-pulse'>Loading Notifications...</h2>
                </div>
            </section>
        );
    }

    return (
        <section className='relative w-full  min-h-screen bg-[#f9f9f6] text-black py-16 px-6 sm:px-10 font-sans'>
            <div className='max-w-4xl mx-auto'>
                
                {/* HEADING ROW */}
                <div className='flex flex-col sm:flex-row justify-between sm:items-end border-b-[4px] border-black pb-6 mb-10 gap-4'>
                    <h2 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none flex items-center gap-3'>
                        <Bell strokeWidth={3} className="w-10 h-10 shrink-0" /> 
                        Notifications
                    </h2>
                    
                    {notifications.length > 0 && (
                        <button
                            onClick={clearAll}
                            className='flex items-center justify-center gap-2 px-6 py-3 bg-white border-[3px] border-black text-black font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
                        >
                            <Trash2 className='w-5 h-5' strokeWidth={2.5} />
                            Clear All
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className='bg-white border-[4px] border-black p-16 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                        <Bell className='w-16 h-16 mx-auto text-black/20 mb-4' strokeWidth={2} />
                        <p className='text-2xl font-black uppercase tracking-tight text-black/50'>No notifications at the moment.</p>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                className={`p-6 border-[3px] border-black flex flex-col sm:flex-row justify-between items-start gap-6 transition-all duration-300 
                                ${n.isRead 
                                    ? 'bg-[#e5e5e5] text-black/60 shadow-none' 
                                    : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                                }`}
                            >
                                <div className='flex-1'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        {/* UNREAD BADGE */}
                                        {!n.isRead && (
                                            <span className='bg-[#ff5500] text-black px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black tracking-widest'>
                                                New
                                            </span>
                                        )}
                                        <h3 className={`font-black uppercase tracking-tight text-xl sm:text-2xl leading-none ${n.isRead ? 'text-black/60' : 'text-black'}`}>
                                            {n.title || "Alert"}
                                        </h3>
                                    </div>
                                    <p className={`font-mono text-sm leading-relaxed ${n.isRead ? 'text-black/50' : 'text-black/80'}`}>
                                        {n.message}
                                    </p>
                                    <p className={`text-xs font-bold mt-2 uppercase tracking-wider ${n.isRead ? 'text-black/40' : 'text-black/60'}`}>
                                        {new Date(n.createdAt).toLocaleString('en-US', { 
                                            year: 'numeric', month: 'short', day: 'numeric', 
                                            hour: '2-digit', minute: '2-digit' 
                                        })}
                                    </p>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className='flex items-center gap-3 shrink-0 w-full sm:w-auto'>
                                    {!n.isRead && (
                                        <button
                                            onClick={() => markAsRead(n._id)}
                                            title="Mark as read"
                                            className='flex-1 sm:flex-none flex items-center justify-center p-3 border-2 border-black bg-white text-black hover:bg-[#4ade80] hover:text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]'
                                        >
                                            <CheckCheck className='w-5 h-5' strokeWidth={2.5} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(n._id)}
                                        title="Delete"
                                        className='flex-1 sm:flex-none flex items-center justify-center p-3 border-2 border-black bg-white text-black hover:bg-red-600 hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]'
                                    >
                                        <X className='w-5 h-5' strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Notifications;