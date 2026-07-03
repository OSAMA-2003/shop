import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const url = "https://shop-3-ocd8.onrender.com/api/admin/login";
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const { data } = await axios.post(url, { email, password });
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                toast.success('Welcome back, Admin', {
                    style: {
                        border: '3px solid black',
                        padding: '16px',
                        color: 'black',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        borderRadius: '0',
                        backgroundColor: '#f9f9f6',
                    },
                    icon: '',
                });
                navigate('/');
            } else {
                toast.error('ACCESS DENIED — Invalid credentials', {
                    style: {
                        border: '3px solid black',
                        padding: '16px',
                        color: '#fff',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        borderRadius: '0',
                        backgroundColor: '#dc2626',
                    },
                    icon: '🚫',
                    duration: 4000,
                });
            }
        } catch (err) {
            console.log(err);
            const isAccessDenied = err.response && (err.response.status === 400 || err.response.status === 401 || err.response.status === 403);
            const message = isAccessDenied ? 'ACCESS DENIED' : 'SERVER ERROR — Try again later';
            const icon = isAccessDenied ? '🚫' : '⚠️';

            toast.error(message, {
                style: {
                    border: '3px solid black',
                    padding: '16px',
                    color: '#fff',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    borderRadius: '0',
                    backgroundColor: '#dc2626',
                },
                icon: icon,
                duration: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black font-sans px-6'>

            <div className='w-full max-w-sm flex flex-col items-start'>

                {/* HEADING */}
                <h1 className='text-6xl sm:text-7xl font-black uppercase tracking-tighter mb-8 text-black leading-none'>
                    Admin<br />Login
                </h1>

                {/* FORM */}
                <form onSubmit={handleSubmit} className='w-full flex flex-col gap-5'>

                    {/* EMAIL INPUT */}
                    <div className='flex flex-col'>
                        <label className='text-sm font-bold text-black mb-1 uppercase tracking-widest'>Email</label>
                        <input
                            type='email'
                            placeholder='ADMIN@EXAMPLE.COM'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className='w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors placeholder-black/30 disabled:opacity-50'
                            required
                        />
                    </div>

                    {/* PASSWORD INPUT */}
                    <div className='flex flex-col'>
                        <label className='text-sm font-bold text-black mb-1 uppercase tracking-widest'>Password</label>
                        <input
                            type='password'
                            placeholder='••••••••'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className='w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors placeholder-black/30 disabled:opacity-50'
                            required
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-[#ff5500] py-4 mt-4 font-black text-2xl sm:text-3xl tracking-widest uppercase text-black hover:bg-black hover:text-[#ff5500] transition-colors rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {loading && <Loader2 className="w-6 h-6 animate-spin text-black" strokeWidth={3} />}
                        <span>{loading ? "Accessing..." : "Access"}</span>
                    </button>

                </form>

            </div>
        </div>
    );
};

export default AdminLogin;