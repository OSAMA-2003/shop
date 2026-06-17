import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContenxt';

const Login = () => {
  const navigate = useNavigate();
  const { url, setToken } = useContext(ShopContext);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({
      ...data,
      [name]: value
    }));
  };
  
  const onLogin = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(`${url}/api/user/login`, formData);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <section className='relative w-full min-h-screen bg-[#f9f9f6] text-black py-20 px-6 sm:px-10 flex items-center justify-center font-sans'>
      
      <div className='w-full max-w-sm flex flex-col items-start'>
        
        {/* HEADING */}
        <h1 className='text-6xl sm:text-7xl font-black uppercase tracking-tighter mb-8 text-black leading-none'>
          Log In
        </h1>

        {/* FORM */}
        <form onSubmit={onLogin} className='w-full flex flex-col gap-5'>
          
          {/* EMAIL INPUT */}
          <div className='flex flex-col'>
            <label className='text-sm font-bold text-black mb-1'>Email</label>
            <input 
              type='email' 
              name='email'
              value={formData.email}
              onChange={onChangeHandler}
              required
              className='w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors'
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className='flex flex-col'>
            <label className='text-sm font-bold text-black mb-1'>Password</label>
            <input 
              type='password'
              name='password'
              autoComplete="current-password"
              value={formData.password}
              onChange={onChangeHandler}
              required
              className='w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors'
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type='submit' 
            className='w-full bg-[#ff5500] py-4 mt-2 font-black text-2xl sm:text-3xl tracking-widest uppercase text-black hover:bg-black hover:text-[#ff5500] transition-colors rounded-none'
          >
            Enter
          </button>

        </form>

        {/* FOOTER LINKS */}
        <div className='flex flex-col mt-6 gap-3'>
          <span className='text-sm font-bold text-black underline decoration-2 cursor-pointer hover:text-[#ff5500] transition-colors'>
            Forgot Password?
          </span>
          <span className='text-sm font-bold text-black'>
            Don't have an account? {" "}
            <span
              onClick={() => navigate("/signup")}
              className='underline decoration-2 cursor-pointer hover:text-[#ff5500] transition-colors'
            >
              Sign up
            </span>
          </span>
        </div>

      </div>
    </section>
  );
};

export default Login;