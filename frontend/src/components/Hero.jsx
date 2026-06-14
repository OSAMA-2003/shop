import React from 'react';
import heroImage from "../assets/herobg.jfif"; // Make sure this points to your new dark background image
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";


const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section 
      className='relative w-full min-h-screen flex items-center bg-cover bg-center bg-no-repeat overflow-hidden'
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Dark Overlay to make text pop like the image */}
      <div className="absolute inset-0 bg-black/80 md:bg-gradient-to-r md:from-black md:to-black/60"></div>

      <div className='relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center'>
        
        <div className='max-w-2xl space-y-7 mt-20 md:mt-10'>
          
          {/* Main Typography */}
          <h1 className='text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-[0.95] tracking-tighter'>
            <span className="text-white block">Redefine</span>
            <span className="text-[#ff5500] block mt-1">The Streets</span>
          </h1>

          {/* Subtext with Orange Left Border */}
          <div className="border-l-[3px] border-[#ff5500] pl-5 mt-8">
            <p className='text-sm sm:text-base text-gray-300 max-w-md font-medium leading-relaxed'>
              High-impact silhouettes engineered for the concrete jungle.<br />
              Uncompromising quality meets brutalist minimal design.
            </p>
          </div>

          {/* Action Buttons (Sharp Edges, Brutalist Style) */}
          <div className='flex flex-col sm:flex-row items-center gap-4 pt-6'>
            <button 
              onClick={() => navigate("/shop")}
              className='w-full rounded-xl sm:w-auto bg-[#ff5500] text-black font-bold uppercase tracking-widest px-8 py-4 text-xs sm:text-sm hover:bg-[#e04a00] transition-colors duration-300'
            >
              Explore Collection
            </button>

            <button 
              onClick={() => navigate("/lookbook")}
              className='w-full rounded-xl sm:w-auto bg-transparent border border-white text-white font-bold uppercase tracking-widest px-8 py-4 text-xs sm:text-sm hover:bg-white hover:text-black transition-colors duration-300'
            >
              View Lookbook
            </button>
          </div>

        </div>

        

      </div>

      {/* Abstract Logo Placeholder (Bottom Right) */}
        <div className="hidden md:blockabsolute md:bottom-10  md:right-10  ">
          <img src={logo} alt="logo" width={80} />
        </div>
    </section>
  )
}

export default Hero;