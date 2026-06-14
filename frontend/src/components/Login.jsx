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
    <section className='relative w-full min-h-screen bg-surface text-text-main py-32 px-6 sm:px-10 flex items-center justify-center'>

      <div className='relative z-10 w-full max-w-md bg-background border border-border-light p-10 
   rounded-3xl shadow-soft'>

        <h2 className='text-3xl sm:text-4xl font-extrabold mb-8 text-center text-text-main'>Login</h2>

        <form onSubmit={onLogin} className='flex flex-col gap-6'>
          <input type='email' name='email'
            placeholder='Email'
            value={formData.email}
            onChange={onChangeHandler}
            required
            className='bg-surface p-4 rounded-xl text-text-main placeholder-text-muted border border-border-light font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all'/>

          <input type='password'
            name='password'
            placeholder='Password'
            autoComplete="current-password"
            value={formData.password}
            onChange={onChangeHandler}
            required
            className='bg-surface p-4 rounded-xl text-text-main placeholder-text-muted border border-border-light font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all'/>

          <button type='submit' className='bg-primary px-6 py-4 rounded-xl font-bold text-white hover:bg-[#d94f15] transition-all shadow-soft mt-2'>
            Log in

          </button>

        </form>
        <p className='mt-8 text-center text-text-muted'>
          Do you have an account? {""}
          <span
            onClick={() => navigate("/signup")}
            className='text-primary font-bold cursor-pointer hover:underline'>
            Create an account
          </span>
        </p>
      </div>
    </section>
  )
}

export default Login;