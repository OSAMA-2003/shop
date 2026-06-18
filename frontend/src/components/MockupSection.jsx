import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MockupGrid from './MockupGrid';
import { ShopContext } from '../context/ShopContenxt';
import { motion } from 'framer-motion';

// 1. Define Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const MockupSection = () => {
  const navigate = useNavigate();
  const { all_mockups } = useContext(ShopContext);

  const formattedMockups = (all_mockups || []).slice(0, 4).map(m => ({
    id: m._id,
    name: m.name,
    preview: m.imageFront || m.image,
    printable: { x: 150, y: 150, width: 300, height: 400 }, // Default relative box mapping
    colors: [
      { name: m.color || 'Black', hex: m.color === 'White' ? '#FFFFFF' : m.color === 'Red' ? '#FF0000' : m.color === 'Blue' ? '#0000FF' : m.color === 'Gray' ? '#808080' : '#000000' }
    ],
  }));

  return (
    <section className='relative w-full min-h-screen bg-background text-text-main py-12 px-6 sm:px-10 flex flex-col justify-center overflow-hidden'>
      
      {/* 
        The parent motion.div handles the scroll trigger and staggers 
        the animation of all its children (Header -> Text -> Grid -> Button)
      */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className='relative z-10 max-w-7xl mx-auto text-center w-full'
      >
       
        <motion.h2 
          variants={itemVariants} 
          className='text-6xl sm:text-7xl font-black uppercase text-center tracking-tighter mb-4 leading-none'
        >
          <span className="text-[#ff5500]">Design</span> Your Own Product
        </motion.h2>
       
        <motion.p 
          variants={itemVariants} 
          className='text-text-muted mb-12 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed'
        >
          Bring your designs to life! Choose a product mockup and customize it with your own graphics, text, and colors.
        </motion.p>

        {/* Mockup Grid OR Coming Soon State */}
        <motion.div variants={itemVariants} className='mb-12 text-left'>
          {formattedMockups.length > 0 ? (
            <MockupGrid mockups={formattedMockups} />
          ) : (
            /* Brutalist Coming Soon Block */
            <div className="w-full py-24 flex flex-col items-center justify-center text-center border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
                Mockups <span className="text-[#ff5500]">Coming Soon</span>
              </h3>
              <p className="mt-4 text-sm font-bold uppercase tracking-widest text-gray-500">
                The lab is currently cooking up new canvases. Stay tuned.
              </p>
            </div>
          )}
        </motion.div>

        {/* Button Wrapper 
            Wrapped in a div so Framer Motion doesn't interfere with your active:translate-y classes 
        */}
        <motion.div variants={itemVariants}>
          <button 
            onClick={() => navigate('/mockups')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#ff5500] border-[3px] border-black text-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-[#ff5500] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
          >
            View All Mockups
          </button>
        </motion.div>
        
      </motion.div>
    </section>
  );
};

export default MockupSection;