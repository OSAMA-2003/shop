import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const url = "https://shop-2-ms77.onrender.com/api/admin/login";
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            navigate('/admin/list');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(url, { email, password });
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin/list');
            } else {
                alert(data.message); // Better UX than just console.log
            }
        } catch (err) {
            console.log(err);
            alert("Server Error"); // Feedback for network/server errors
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black font-sans px-6'>
            
            <div className='w-full max-w-sm flex flex-col items-start'>
                
                {/* HEADING */}
                <h1 className='text-6xl sm:text-7xl font-black uppercase tracking-tighter mb-8 text-black leading-none'>
                    Admin<br/>Login
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
                            className='w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors placeholder-black/30'
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
                            className='w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors placeholder-black/30'
                            required
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button 
                        type='submit' 
                        className='w-full bg-[#ff5500] py-4 mt-4 font-black text-2xl sm:text-3xl tracking-widest uppercase text-black hover:bg-black hover:text-[#ff5500] transition-colors rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
                    >
                        Access
                    </button>

                </form>

            </div>
        </div>
    );
}

export default AdminLogin;