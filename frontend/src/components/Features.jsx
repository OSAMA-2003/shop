import React from 'react';
import { Truck, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";

const featuresData = [
  {
    Icon: Truck,
    title: "Free Shipping",
    desc: "On orders over $100 worldwide",
  },
  {
    Icon: ShieldCheck,
    title: "Product Warranty",
    desc: "Free Returns or Exchanges within 14 Days",
  },
  {
    Icon: RefreshCcw,
    title: "Easy Returns",
    desc: "Simple and Fast Process in Minutes",
  },
  {
    Icon: Headphones,
    title: "24/7 Support",
    desc: "Our Team Is Ready to Assist You Anytime",
  },
];

const Features = () => {
  return (
    <section className='relative w-full bg-[#f9f9f6] text-black py-24 border-y-[4px] border-black font-sans'>
      <div className='relative z-10 max-w-7xl mx-auto px-6 sm:px-10'>
        
        {/* HEADING */}
        <h2 className='text-5xl sm:text-6xl font-black uppercase tracking-tighter mb-16 text-center leading-none'>
          Why Choose <span className="text-[#ff5500]"> Us </span>
        </h2>

        {/* FEATURES GRID */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {featuresData.map(({ Icon, title, desc }, index) => (
            <div 
              key={index} 
              className='bg-white border-[4px] border-black p-8 flex flex-col items-center text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all group'
            >
              
              {/* ICON BOX */}
              <div className='w-20 h-20 bg-[#e5e5e5] border-[3px] border-black flex items-center justify-center mb-6 group-hover:bg-[#ff5500] transition-colors duration-300'>
                <Icon className='w-10 h-10 text-black' strokeWidth={2.5} />
              </div>

              {/* TITLE & DESC */}
              <h3 className='text-2xl font-black uppercase tracking-tight mb-3 leading-none'>
                {title}
              </h3>
              <p className='font-mono text-sm font-bold text-black/70 leading-relaxed'>
                {desc}
              </p>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;