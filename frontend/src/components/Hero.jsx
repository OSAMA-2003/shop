import React from 'react';
import {ShoppingCart} from "lucide-react" ;
import heroImage from "../assets/herobg.png";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className='relative w-full min-h-screen bg-linear-to-r from-indigo-900
via-purple-900 to-pink-900 text-white flex items-center'>
  <div className='absolute inset-0 bg-black/40'></div>

  <div className='relative z-10 max-w-7xl mx-auto px-6 sm:px-10 flex flex-col-reverse
    md:flex-row items-center gap-16'>

    {/* النصوص */}
    <div className='flex-1 space-y-6'>
      <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug tracking-tight'>
        Discover the latest products with the best discounts!
      </h1>

      <p className='text-base sm:text-lg md:text-xl text-gray-200 max-w-xl'>
        Shop now and enjoy unbeatable deals on electronics, fashion, and premium products.
        Get discounts of up to 50% for a limited time.
      </p>

      <div className='flex flex-col sm:flex-row items-center gap-4 mt-4'>
        <button onClick={() => navigate("/shop")}
          className='flex items-center gap-2 bg-cyan-400
          hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-2xl text-base shadow-xl
          transition-transform transform hover:scale-105'>
          <ShoppingCart className='w-5 h-5'/>
          Shop Now
        </button>

        <button onClick={() => navigate("/categories")}
          className='flex items-center gap-2 bg-cyan-400
          hover:bg-cyan-500 text-indigo-900 font-bold px-6 py-3 rounded-2xl text-base shadow-xl
          transition-transform transform hover:scale-105'>
          Browse Categories
        </button>
      </div>
    </div>

    {/* الصورة */}
    <div className='flex-1 relative w-full max-w-lg'>
      <img src={heroImage} className='w-full h-full object-cover rounded-3xl shadow-2xl'/>
      <div className='absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full
        font-bold shadow-lg animate-pulse text-base'>
        Up to 50% Off
      </div>
    </div>

  </div>

  

</section>



  )
}

export default Hero