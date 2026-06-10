import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; // useContext is not used in this component, so it can be removed if not needed elsewhere
import axios from 'axios';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContenxt';

const Login = () => {


  const navigate = useNavigate();
  const [state, setState] = useState("login");
  const { url, setToken } = useContext(ShopContext)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
  const name = event.target.name;
  const value = event.target.value;

    setFormData((data)=>({
      ...data, [name] : value
    }))
  }
  
  const onLogin = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(
        url + "/api/user/login",
        formData
      );

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
    <section className='relative w-full min-h-screen bg-linear-to-r from-indigo-900
    via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10 flex
    items-center justify-center'>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm p-10 pointer-events-none'>
      </div>
      <div className='relative z-10 max-w-md bg-white/10 backdrop-blur-md p-10 
   rounded-3xl shadow-2xl'>

        <h2 className='text-3xl sm:text-4xl font-extrabold mb-6 text-center'> Login</h2>

        <form onSubmit={onLogin} className='flex flex-col gap-6'>
          <input type='email' name='email'
            placeholder='Email'
            value={formData.email}
            onChange={onChangeHandler}
            required
            className=' bg-white/30 p-4 rounded-xl text-black placeholder-gray-600 font-semibold
  focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all '/>

          <input type='password'
            name='password'
            placeholder='Password'
            autoComplete="current-password"
            value={formData.password}
            onChange={onChangeHandler}
            required
            className=' bg-white/30 p-4 rounded-xl text-black placeholder-gray-600 font-semibold
  focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all '/>

          <button type='submit' className='bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-6
     py-3 rounded-2xl font-semibold text-white hover:opacity-90 transition-all shadow-lg'>
            Log in

          </button>

        </form>
        <p className='mt-6 text-center text-gray-300'>
          Do you have an account? {""}
          <span
            onClick={() => navigate("/signup")}
            className='text-cyan-400 font-semibold cursor-pointer hover:underline'>
            Create an account
          </span>
        </p>
      </div>
    </section>
  )
}

export default Login;