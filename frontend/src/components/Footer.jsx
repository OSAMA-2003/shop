import React from 'react';

const Footer = () => {
  return (
    <footer className='w-full bg-black text-[#f9f9f6] py-12 px-6 sm:px-10 font-sans border-t-[6px] border-black'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8'>
        
        {/* COPYRIGHT */}
        <div className='text-center md:text-left'>
          <h2 className='text-3xl font-black uppercase tracking-tighter mb-2'>
            E-Commerce<span className="text-[#ff5500]">.</span>
          </h2>
          <p className='font-mono text-sm font-bold text-[#f9f9f6]/60 uppercase'>
            © 2025 All rights reserved.
          </p>
        </div>

        {/* SOCIAL LINKS */}
        <div className='flex flex-wrap justify-center gap-6 sm:gap-8'>
          <a href="#" className='font-black uppercase tracking-widest text-sm hover:text-[#ff5500] hover:-translate-y-1 transition-all'>
            Facebook
          </a>
          <a href="#" className='font-black uppercase tracking-widest text-sm hover:text-[#ff5500] hover:-translate-y-1 transition-all'>
            Twitter
          </a>
          <a href="#" className='font-black uppercase tracking-widest text-sm hover:text-[#ff5500] hover:-translate-y-1 transition-all'>
            Instagram
          </a>
          <a href="#" className='font-black uppercase tracking-widest text-sm hover:text-[#ff5500] hover:-translate-y-1 transition-all'>
            LinkedIn
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;