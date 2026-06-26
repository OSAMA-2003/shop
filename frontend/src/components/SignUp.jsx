import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import axios from 'axios';
import { ShopContext } from "../context/ShopContenxt";
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { url, setToken } = useContext(ShopContext);

  const handleGoogleSuccess = async (tokenResponse) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${url}/api/user/google-auth`, {
        token: tokenResponse.access_token,
        isAccessToken: true
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        toast.success("Account created and logged in with Google successfully!");
        navigate(from);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Google Signup Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Google Sign-In failed. Please try again.")
  });
  
  const from = location.state?.from || "/";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({
      ...data,
      [name]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        url + "/api/user/signup",
        formData
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        toast.success("Account created successfully!");
        navigate(from);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Sign Up Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='relative w-full min-h-screen bg-[#f9f9f6] text-black py-30 px-6 sm:px-10 flex items-center justify-center font-sans'>
      
      <div className='w-full max-w-sm flex flex-col items-start'>

        {/* HEADING */}
        <h1 className='text-6xl sm:text-7xl font-black uppercase tracking-tighter mb-8 text-black leading-none'>
          Sign Up
        </h1>

        {/* FORM */}
        <form onSubmit={onSignUp} className='w-full flex flex-col gap-5'>
          
          {/* NAME INPUT */}
          <div className='flex flex-col'>
            <label className='text-sm font-bold text-black mb-1'>Full Name</label>
            <input 
              type='text'
              name='name'
              value={formData.name}
              onChange={onChangeHandler}
              required
              className='w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors'
            />
          </div>

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
              autoComplete="new-password"
              value={formData.password}
              onChange={onChangeHandler}
              required
              className='w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors'
            />
          </div>

          {/* CONFIRM PASSWORD INPUT */}
          <div className='flex flex-col'>
            <label className='text-sm font-bold text-black mb-1'>Confirm Password</label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={onChangeHandler}
              required
              className='w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors'
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type='submit' 
            disabled={isSubmitting}
            className='w-full bg-[#ff5500] py-4 mt-2 font-black text-2xl sm:text-3xl tracking-widest uppercase text-black hover:bg-black hover:text-[#ff5500] transition-colors rounded-none disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-6 h-6 text-black" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </button>

          {/* OR DIVIDER */}
          <div className="flex items-center gap-3 my-2 w-full">
            <div className="flex-1 h-[2px] bg-black"></div>
            <span className="text-xs font-black uppercase text-black select-none">or</span>
            <div className="flex-1 h-[2px] bg-black"></div>
          </div>

          {/* GOOGLE SIGN IN */}
          <div className="w-full">
            <button 
              type="button" 
              onClick={() => loginWithGoogle()}
              className="w-full bg-white border-[3px] border-black py-4 mt-2 font-black text-xl sm:text-2xl tracking-wider uppercase text-black hover:bg-black hover:text-[#ff5500] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google Auth
            </button>
          </div>
        </form>

        {/* FOOTER LINKS */}
        <div className='flex flex-col mt-6 gap-3'>
          <span className='text-sm font-bold text-black'>
            Already have an account? {" "}
            <span
              onClick={() => navigate("/login", { state: { from } })}
              className='underline decoration-2 cursor-pointer hover:text-[#ff5500] transition-colors'
            >
              Log in
            </span>
          </span>
        </div>

      </div>
    </section>
  );
};

export default SignUp;