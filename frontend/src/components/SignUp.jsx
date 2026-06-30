import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { ShopContext } from "../context/ShopContenxt";
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
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

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSignUp = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        url + "/api/user/signup",
        data
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
        <form onSubmit={handleSubmit(onSignUp)} className='w-full flex flex-col gap-5'>

          {/* NAME INPUT */}
          <div className='flex flex-col'>
            <label className='text-sm font-bold text-black mb-1'>Full Name</label>
            <input
              type='text'
              {...register("name", { required: "Full name is required" })}
              className={`w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <span className="text-red-500 text-xs font-bold mt-1">{errors.name.message}</span>}
          </div>

          {/* EMAIL INPUT */}
          <div className='flex flex-col'>
            <label className='text-sm font-bold text-black mb-1'>Email</label>
            <input
              type='email'
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={`w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <span className="text-red-500 text-xs font-bold mt-1">{errors.email.message}</span>}
          </div>

          {/* PASSWORD INPUT */}
          <div className='flex flex-col'>
            <label className='text-sm font-bold text-black mb-1'>Password</label>
            <input
              type='password'
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
              className={`w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <span className="text-red-500 text-xs font-bold mt-1">{errors.password.message}</span>}
          </div>

          {/* CONFIRM PASSWORD INPUT */}
          <div className='flex flex-col'>
            <label className='text-sm font-bold text-black mb-1'>Confirm Password</label>
            <input
              type='password'
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: val => val === watch('password') || "Passwords do not match"
              })}
              className={`w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && <span className="text-red-500 text-xs font-bold mt-1">{errors.confirmPassword.message}</span>}
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
              <FcGoogle className="w-7 h-7 shrink-0" />
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