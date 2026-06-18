import React from 'react';
import { motion } from 'framer-motion';

// 1. Define Animation Variants
const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const Footer = () => {
  // Array of social links to easily map and stagger them
  const socialLinks = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'];

  return (
    <footer className='w-full bg-black text-[#f9f9f6] py-12 px-6 sm:px-10 font-sans border-t-[6px] border-black overflow-hidden'>
      <motion.div 
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8'
      >
        
        {/* COPYRIGHT */}
        <motion.div variants={itemVariants} className='text-center md:text-left'>
          <h2 className='text-3xl font-black uppercase tracking-tighter mb-2'>
            E-Commerce<span className="text-[#ff5500]">.</span>
          </h2>
          <p className='font-mono text-sm font-bold text-[#f9f9f6]/60 uppercase'>
            © 2025 All rights reserved.
          </p>
        </motion.div>

        {/* SOCIAL LINKS */}
        <div className='flex flex-wrap justify-center gap-6 sm:gap-8'>
          {socialLinks.map((platform, index) => (
            <motion.div key={index} variants={itemVariants}>
              <a 
                href="#" 
                className='block font-black uppercase tracking-widest text-sm hover:text-[#ff5500] hover:-translate-y-1 transition-all'
              >
                {platform}
              </a>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </footer>
  );
}

export default Footer;