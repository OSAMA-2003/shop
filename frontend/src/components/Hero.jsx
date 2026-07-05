import React from 'react';
import { motion } from 'framer-motion';
import desktopHeroImage from "../assets/hero-bg.png";
import mobileHeroImage from "../assets/mobile-hero.png";
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import { useTranslation } from 'react-i18next';

// 1. Define Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  return (
    <section className='relative w-full min-h-screen flex items-start md:items-center overflow-hidden'>
      {/* Mobile Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat md:hidden -z-10"
        style={{
          backgroundImage: `url(${mobileHeroImage})`,
          transform: isRTL ? 'scaleX(-1)' : 'none'
        }}
      />

      {/* Desktop Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat hidden md:block -z-10"
        style={{
          backgroundImage: `url(${desktopHeroImage})`,
          transform: isRTL ? 'scaleX(-1)' : 'none'
        }}
      />

      <div className='relative z-10 w-full max-w-8xl mx-auto px-6 sm:px-10 flex flex-col md:justify-center'>
        <motion.div
          className='max-w-2xl space-y-7 mt-20 md:mt-10'
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {/* Main Typography */}
          <h1 className='text-5xl md:text-7xl font-black uppercase  tracking-tighter flex flex-col pt-10'>
            <span className="overflow-hidden block">
              <motion.span variants={textRevealVariants} className="text-white block">
                {t('hero.ignite')}
              </motion.span>
            </span>
            <span className="overflow-hidden block">
              <motion.span variants={textRevealVariants} className="text-[#ff5500] block">
                {t('hero.creative')}
              </motion.span>
            </span>
            <span className="overflow-hidden block mt-2 pb-2">
              <motion.span variants={textRevealVariants} className="text-white block">
                {t('hero.flow')}
              </motion.span>
            </span>
          </h1>

          {/* Subtext */}
          <motion.div
            variants={slideInLeftVariants}
            className="border-l-[3px] border-[#ff5500] pl-5 mt-8 hidden md:block"
          >
            <p className='text-sm sm:text-base text-gray-300 max-w-md font-medium leading-relaxed'>
              {t('hero.subtext')}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className='flex flex-row md:flex-col items-center md:items-start gap-4 pt-90 md:pt-10'>
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                document.getElementById('mockups')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-start justify-start gap-2 px-5 md:px-20 py-4 bg-[#ff5500] border-[1px] border-black hover:border-white text-white text-[13px] font-black uppercase tracking-widest hover:bg-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] cursor-pointer"
            >
              {t('hero.explore')}
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-10 md:px-20 py-4 hover:bg-[#ff5500] border border-white text-[13px] font-black uppercase tracking-widest bg-black text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] cursor-pointer"
            >
              {t('hero.view')}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Abstract Logo Placeholder */}
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
  );
}

export default Hero;