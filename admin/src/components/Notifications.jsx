import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Bell, Trash2, CheckCheck, Loader2, X } from "lucide-react";

function Notifications() {

    const url = 'https://shop-2-ms77.onrender.com'
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchNotifications = async ()=>{
        try{
            const res = await axios.get(`${url}/api/notifications/list`)
            setNotifications(res.data.data || [])

        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }        

    const deleteNotification = async (id)=>{
        try {
            await axios.delete(`${url}/api/notifications/delete/${id}`)
            setNotifications((prev) => prev.filter((n)=>n._id !== id) )
        } catch (err) {
            console.log(err)
        }
    }

    const clearAll = async()=>{
        try {
            await axios.delete(`${url}/api/notifications/clear`)
            setNotifications([])
        } catch (err) {
            console.log(err)
        }
    }

   const markAsRead = async(id)=>{
    try {
        await axios.patch(`${url}/api/notifications/read/${id}`)
        setNotifications((prev)=>prev.map((n)=> (n._id === id ?{...n, isRead:true}:n)))
    } catch (err) {
        console.log(err)
    }
   }

   useEffect(()=>{
    fetchNotifications()
   },[])
    
    if (loading) {
        return (
            <section className='min-h-screen flex items-center justify-center bg-linear-to-r from-indigo-900 via-purple-800 to-pink-900 text-white px-6'>
                <div className='flex flex-col items-center'>
                    <Loader2 className='w-20 h-20 animate-spin text-cyan-400 mb-6' />
                    <h2 className='text-2xl font-semibold'>Loading notifications...</h2>
                </div>
            </section>
        )
    }

  return (
    <section className='md:ml-64 min-h-screen bg-linear-to-r from-indigo-900 
    via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10'>
        <div className='max-w-4xl mx-auto'>
            <div className='flex justify-between items-center mb-10'>
                <h2 className='text-4xl font-extrabold flex items-center gap-3'>
                    <Bell className='w-10 h-10 text-cyan-400' />
                    Notifications
                </h2>
                {notifications.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className='flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-all shadow-lg'
                    >
                        <Trash2 className='w-5 h-5' />
                        Clear All
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className='text-center py-20 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20'>
                    <Bell className='w-16 h-16 mx-auto text-gray-400 mb-4 opacity-50' />
                    <p className='text-xl text-gray-300 font-medium'>No notifications at the moment.</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {notifications.map((n) => (
                        <div 
                            key={n._id} 
                            className={`group relative p-6 rounded-2xl border transition-all duration-300 flex justify-between items-start gap-4 
                            ${n.isRead 
                                ? 'bg-white/5 border-white/10 opacity-80' 
                                : 'bg-white/15 border-white/30 shadow-xl'}`}
                        >
                            <div className='flex-1'>
                                <div className='flex items-center gap-3 mb-2'>
                                    {!n.isRead && (
                                        <span className='w-3 h-3 bg-cyan-400 rounded-full animate-pulse' />
                                    )}
                                    <h3 className={`font-bold text-lg ${n.isRead ? 'text-gray-400' : 'text-white'}`}>
                                        {n.title || "Notification"}
                                    </h3>
                                </div>
                                <p className={`${n.isRead ? 'text-gray-400' : 'text-gray-200'}`}>
                                    {n.message}
                                </p>
                            </div>

                            <div className='flex items-center gap-2'>
                                {!n.isRead && (
                                    <button 
                                        onClick={() => markAsRead(n._id)}
                                        title="Mark as read"
                                        className='p-2 hover:bg-cyan-500/20 rounded-lg transition-colors text-cyan-400'
                                    >
                                        <CheckCheck className='w-6 h-6' />
                                    </button>
                                )}
                                <button 
                                    onClick={() => deleteNotification(n._id)}
                                    title="Delete"
                                    className='p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400'
                                >
                                    <X className='w-6 h-6' />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </section>
  )
}

export default Notifications