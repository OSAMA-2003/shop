import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import axios from 'axios';
import { ShopContext } from "../context/ShopContenxt";
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { url, setToken } = useContext(ShopContext);
  
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