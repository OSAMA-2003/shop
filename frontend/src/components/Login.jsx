import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ShopContext } from '../context/ShopContenxt';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
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
        toast.success(t('auth.googleSuccess'));
        navigate(from);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || t('auth.googleFail'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error(t('auth.googleFail'))
  });

  const from = location.state?.from || "/";

  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.from) {
      const timer = setTimeout(() => {
        toast.error(t('auth.pleaseLogin'));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state, t]);

  const onLogin = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${url}/api/user/login`, data);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        toast.success(t('auth.loginSuccess'));
        navigate(from);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      const errorMsg = err.response?.data?.message || "Server Error";

      if (errorMsg.toLowerCase().includes("user not found")) {
        setError("email", { type: "server", message: t('auth.userNotFound') });
      } else if (errorMsg.toLowerCase().includes("invalid credentials")) {
        setError("password", { type: "server", message: t('auth.incorrectPassword') });
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='relative w-full min-h-screen bg-[#f9f9f6] text-black py-20 px-6 sm:px-10 flex items-center justify-center font-sans'>
      <div className='w-full max-w-sm flex flex-col items-start'>

        {/* HEADING */}
        <h1 className={`text-6xl sm:text-7xl font-black uppercase tracking-tighter mb-8 text-black leading-none w-full ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('auth.loginHeader')}
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit(onLogin)} className='w-full flex flex-col gap-5'>

          {/* EMAIL INPUT */}
          <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
            <label className='text-sm font-bold text-black mb-1'>{t('auth.email')}</label>
            <input
              type='email'
              {...register("email", {
                required: t('auth.emailRequired'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('auth.emailInvalid')
                }
              })}
              className={`w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors ${errors.email ? 'border-red-500' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
            />
            {errors.email && <span className="text-red-500 text-xs font-bold mt-1">{errors.email.message}</span>}
          </div>

          {/* PASSWORD INPUT */}
          <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
            <label className='text-sm font-bold text-black mb-1'>{t('auth.password')}</label>
            <input
              type='password'
              autoComplete="current-password"
              {...register("password", {
                required: t('auth.passwordRequired')
              })}
              className={`w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black transition-colors ${errors.password ? 'border-red-500' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
            />
            {errors.password && <span className="text-red-500 text-xs font-bold mt-1">{errors.password.message}</span>}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-[#ff5500] py-4 mt-2 font-black text-2xl sm:text-3xl tracking-widest uppercase text-black hover:bg-black hover:text-[#ff5500] transition-colors rounded-none disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer'
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-6 h-6 text-black" />
                {t('auth.entering')}
              </>
            ) : (
              t('auth.enterBtn')
            )}
          </button>

          {/* OR DIVIDER */}
          <div className="flex items-center gap-3 my-2 w-full">
            <div className="flex-1 h-[2px] bg-black"></div>
            <span className="text-xs font-black uppercase text-black select-none">{t('auth.or')}</span>
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
              {t('auth.googleAuth')}
            </button>
          </div>

        </form>

        {/* FOOTER LINKS */}
        <div className={`flex mt-6 gap-3 w-full ${isRTL ? 'justify-end' : 'justify-start'}`}>
          <span className='text-sm font-bold text-black'>
            {t('auth.noAccount')}{" "}
            <span
              onClick={() => navigate("/signup", { state: { from } })}
              className='underline decoration-2 cursor-pointer hover:text-[#ff5500] transition-colors font-black'
            >
              {t('auth.signupLink')}
            </span>
          </span>
        </div>

      </div>
    </section>
  );
};

export default Login;