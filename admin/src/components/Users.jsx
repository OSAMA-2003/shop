import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Shield, Trash2, ArrowDown, ArrowUp } from "lucide-react";
import toast from 'react-hot-toast';

const Users = () => {
    const url = "https://shop-3-ocd8.onrender.com";
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const toastStyle = {
        style: {
            border: '3px solid black',
            padding: '16px',
            color: 'black',
            fontWeight: '900',
            textTransform: 'uppercase',
            borderRadius: '0',
            backgroundColor: '#f9f9f6',
        },
    };

    const errorToastStyle = {
        style: {
            border: '3px solid black',
            padding: '16px',
            color: '#fff',
            fontWeight: '900',
            textTransform: 'uppercase',
            borderRadius: '0',
            backgroundColor: '#dc2626',
        },
    };

    const demoteToUser = async (id) => {
        try {
            await axios.put(`${url}/api/user/make-user/${id}`);
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === id ? { ...u, role: "user" } : u
                )
            );
            toast.success('User has been successfully demoted', toastStyle);
        } catch (error) {
            console.error("Error in demoting the role", error);
            toast.error('Error demoting the role', errorToastStyle);
        }
    };

    const promoteToAdmin = async (id) => {
        try {
            await axios.put(`${url}/api/user/make-admin/${id}`);
            setUsers((prev) =>
                prev.map((u) => (u._id === id ? { ...u, role: "admin" } : u))
            );
            toast.success('User has been promoted to admin', toastStyle);
        } catch (error) {
            console.error("Error in promotion", error);
            toast.error('Error during promotion', errorToastStyle);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${url}/api/user/users`);
            if (res.data && res.data.success) {
                setUsers(res.data.data || []);
            } else {
                setUsers([]);
            }
        } catch (err) {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        toast((t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '14px' }}>
                    🗑️ Delete this user?
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const res = await axios.delete(`${url}/api/user/delete/${id}`);
                                if (res.data && res.data.success) {
                                    setUsers((prev) => prev.filter((u) => u._id !== id));
                                    toast.success('User deleted successfully', toastStyle);
                                } else {
                                    toast.error('Deletion failed, check the server', errorToastStyle);
                                }
                            } catch (error) {
                                console.error("Error in deleting the user");
                                toast.error('Deletion failed', errorToastStyle);
                            }
                        }}
                        style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: '3px solid black', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.05em', fontSize: '12px' }}
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        style={{ padding: '8px 20px', background: '#e5e5e5', color: 'black', border: '3px solid black', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.05em', fontSize: '12px' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            style: {
                border: '3px solid black',
                padding: '16px',
                borderRadius: '0',
                backgroundColor: '#f9f9f6',
            },
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <section className='md:ml-64 min-h-screen bg-[#f9f9f6] text-black py-16 px-6 sm:px-10 font-sans'>
            <div className='max-w-7xl mx-auto'>

                {/* HEADING */}
                <div className='border-b-[4px] border-black pb-6 mb-10'>
                    <h2 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none'>
                        User Management
                    </h2>
                </div>

                {loading ? (
                    <div className='bg-white border-[4px] border-black p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                        <p className='text-2xl font-black uppercase tracking-tight animate-pulse'>Loading Users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className='bg-white border-[4px] border-black p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                        <p className='text-2xl font-black uppercase tracking-tight'>No users found.</p>
                    </div>
                ) : (
                    <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8'>
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className='bg-white border-[4px] border-black p-6 flex flex-col items-center text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all'
                            >
                                {/* AVATAR BLOCK */}
                                <div className='w-24 h-24 border-[3px] border-black bg-[#e5e5e5] flex items-center justify-center mb-5 shrink-0 overflow-hidden relative'>
                                    {user.avatar ? (
                                        <img src={user.avatar} className='w-full h-full object-cover mix-blend-multiply' alt={user.name} />
                                    ) : (
                                        <User className='w-12 h-12 text-black' strokeWidth={2.5} />
                                    )}
                                    {/* Small Absolute Role Indicator */}
                                    {user.role === "admin" && (
                                        <div className="absolute top-0 right-0 bg-[#ff5500] border-l-[3px] border-b-[3px] border-black p-1">
                                            <Shield className="w-4 h-4 text-black" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>

                                {/* USER INFO */}
                                <h3 className='text-2xl font-black uppercase tracking-tight leading-none mb-1'>
                                    {user.name}
                                </h3>
                                <p className='text-sm font-mono text-black/70 mb-4 truncate w-full'>
                                    {user.email}
                                </p>

                                <div className={`px-4 py-1 border-[3px] border-black text-sm font-black uppercase tracking-widest mb-6 ${user.role === "admin"
                                    ? "bg-[#ff5500] text-black"
                                    : "bg-black text-white"
                                    }`}>
                                    {user.role === "admin" ? "Admin" : "User"}
                                </div>

                                {/* ACTIONS CONTAINER */}
                                <div className="w-full flex flex-col gap-3 mt-auto pt-4 border-t-[3px] border-black">

                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        disabled={user.role !== "user"}
                                        className={`flex items-center justify-center gap-2 w-full py-3 border-[3px] border-black font-black uppercase tracking-widest transition-all ${user.role === "admin"
                                            ? "bg-[#e5e5e5] text-black/30 border-black/30 cursor-not-allowed"
                                            : "bg-white text-red-600 hover:bg-red-600 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
                                            }`}
                                    >
                                        <Trash2 className='w-5 h-5' strokeWidth={2.5} />
                                        Delete
                                    </button>

                                    {/* PROMOTE BUTTON */}
                                    <button
                                        onClick={() => promoteToAdmin(user._id)}
                                        disabled={user.role !== "user"}
                                        className={`flex items-center justify-center gap-2 w-full py-3 border-[3px] border-black font-black uppercase tracking-widest transition-all ${user.role === "admin"
                                            ? "hidden" // Hide promote button if already admin
                                            : "bg-[#ff5500] text-black hover:bg-black hover:text-[#ff5500] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
                                            }`}
                                    >
                                        <ArrowUp className='w-5 h-5' strokeWidth={3} />
                                        Make Admin
                                    </button>

                                    {/* DEMOTE BUTTON */}
                                    <button
                                        onClick={() => demoteToUser(user._id)}
                                        disabled={user.role !== "admin"}
                                        className={`flex items-center justify-center gap-2 w-full py-3 border-[3px] border-black font-black uppercase tracking-widest transition-all ${user.role === "user"
                                            ? "hidden" // Hide demote button if already user
                                            : "bg-black text-white hover:bg-white hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
                                            }`}
                                    >
                                        <ArrowDown className='w-5 h-5' strokeWidth={3} />
                                        Revoke Admin
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Users;