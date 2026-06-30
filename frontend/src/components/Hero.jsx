import React from 'react';
import { motion } from 'framer-motion';
import desktopHeroImage from "../assets/hero-bg3.jpg";
import mobileHeroImage from "../assets/mobile-hero.jpg";
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";

// 1. Define Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1, // Reduced initial delay slightly for faster scroll-in feeling
    },
  },
};

const textRevealVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideInLeftVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const buttonVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className='relative w-full min-h-screen flex items-start md:items-center overflow-hidden'>
      {/* Mobile Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat md:hidden -z-10"
        style={{ backgroundImage: `url(${mobileHeroImage})` }}
      />

      {/* Desktop Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat hidden md:block -z-10"
        style={{ backgroundImage: `url(${desktopHeroImage})` }}
      />

      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 z-0 bg-black/80 md:bg-gradient-to-r md:from-black md:to-black/60"></div> */}

      <div className='relative z-10 w-full max-w-8xl mx-auto px-6 sm:px-10 flex flex-col md:justify-center'>

        {/* Changed animate to whileInView and added the viewport prop */}
        <motion.div
          className='max-w-2xl space-y-7 mt-20 md:mt-10'
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {/* Main Typography */}
          <h1 className='text-5xl  md:text-7xl font-black uppercase leading-[0.95] tracking-tighter flex flex-col pt-10'>
            <span className="overflow-hidden block">
              <motion.span variants={textRevealVariants} className="text-white block">
                Redefine
              </motion.span>
            </span>
            <span className="overflow-hidden block mt-2 pb-2">
              <motion.span variants={textRevealVariants} className="text-[#ff5500] block">
                Streets
              </motion.span>
            </span>
          </h1>

          {/* Subtext */}
          <motion.div
            variants={slideInLeftVariants}
            className="border-l-[3px] border-[#ff5500] pl-5 mt-8 hidden md:block"
          >
            <p className='text-sm sm:text-base text-gray-300 max-w-md font-medium leading-relaxed'>
              High-impact silhouettes engineered for the concrete jungle.<br />
              Uncompromising quality meets brutalist minimal design.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className='flex flex-row md:flex-col  items-center  md:items-start  gap-4 pt-80 md:pt-10'>
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}

              onClick={() => {
                document.getElementById('mockups')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-start  justify-start  gap-2 px-5 md:px-20 py-4 bg-[#ff5500] border-[1px] border-black hover:border-white text-white text-sm font-black uppercase tracking-widest hover:bg-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
            >
              Explore Mockups
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center  gap-2 px-10 md:px-20 py-4 hover:bg-[#ff5500] border-1 border-white text-sm font-black uppercase tracking-widest bg-black text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
            >
              View Collections
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Abstract Logo Placeholder - Updated for scroll-triggering */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block absolute md:bottom-10 md:right-10"
      >
        <img src={logo} alt="logo" width={80} />
      </motion.div>
    </section>
  )
}

export default Hero;