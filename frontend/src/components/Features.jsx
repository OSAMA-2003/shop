import React from 'react';
import { Truck, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";
import { motion } from 'framer-motion';

const featuresData = [
  {
    Icon: Truck,
    title: "Fast Shipping",
    desc: "On orders in Egypt",
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

// 1. Define Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Pops each card in one after another
      delayChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// Sharp slide-up for the brutalist cards
const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const Features = () => {
  return (
    <section className='relative w-full bg-[#f9f9f6] text-black py-24 border-y-[4px] border-black font-sans overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-6 '>

        {/* HEADING - Animated to slide up */}
        <motion.h2
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className='text-5xl sm:text-6xl font-black uppercase tracking-tighter mb-16 text-center leading-none'
        >
          Why Choose <span className="text-[#ff5500]"> Us </span>
        </motion.h2>

        {/* FEATURES GRID - Staggered container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
        >
          {featuresData.map(({ Icon, title, desc }, index) => (
            /* 
              We animate a wrapper div here. 
              This prevents Framer Motion's inline transform styles from 
              overriding your awesome Tailwind hover:translate classes!
            */
            <motion.div variants={cardVariants} key={index}>
              <div
                className='relative h-full overflow-hidden bg-white border-[4px] border-black p-8 flex flex-col items-start text-left shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[7px_7px_0px_0px_#ff5500] hover:bg-black transition-all group cursor-pointer duration-300'
              >
                {/* Background Number */}
                <div className="absolute -bottom-6 -right-2 text-9xl font-black text-black/5 group-hover:text-[#ff5500]/20 transition-colors duration-300 pointer-events-none select-none">
                  0{index + 1}
                </div>

                {/* ICON BOX */}
                <div className='relative w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center mb-12 group-hover:bg-[#ff5500] group-hover:border-[#ff5500] transition-colors duration-300 z-10'>
                  <Icon className='w-8 h-8 text-black group-hover:text-white transition-colors duration-300' strokeWidth={2.5} />
                </div>

                {/* TITLE & DESC */}
                <h3 className='relative text-2xl font-black uppercase tracking-tight mb-3 leading-none text-black group-hover:text-white transition-colors duration-300 z-10'>
                  {title}
                </h3>
                <p className='relative font-mono text-sm font-bold text-black/70 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 z-10'>
                  {desc}
                </p>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default Features;