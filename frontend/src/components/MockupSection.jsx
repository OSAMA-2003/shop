import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContenxt';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MockupCard from './MockupCard';
import CardSkeleton from './CardSkeleton';

// Animation Variants
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
  const { all_mockups, loading } = useContext(ShopContext);
  const scrollRef = useRef(null);

  // Formatting items for the MockupCard component
  const formattedMockups = (all_mockups || []).slice(0, 8).map(m => ({
    id: m._id,
    name: m.name,
    preview: m.imageFront || m.image,
    printable: { x: 150, y: 150, width: 300, height: 400 },
    colors: [
      { name: m.color || 'Black', hex: m.color === 'White' ? '#FFFFFF' : m.color === 'Red' ? '#FF0000' : m.color === 'Blue' ? '#0000FF' : m.color === 'Gray' ? '#808080' : '#000000' }
    ],
  }));

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = 344; // Approx width sm:320px + gap:24px
      const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className='relative w-full min-h-screen bg-[#f4f6f8] text-text-main  md:py-10 px-6 sm:px-10 flex flex-col justify-center overflow-hidden'>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className='relative z-10 max-w-7xl mx-auto w-full'
      >
        {/* Top Header Row with Title and Scroll Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div variants={itemVariants} className=" text-center md:text-left">
            <h2 className="text-6xl sm:text-7xl font-black uppercase tracking-tighter mb-4 leading-none text-black">
              <span className="text-[#ff5500]">Design</span> Your Own Product
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed font-medium">
              Bring your designs to life! Choose a product mockup and customize it with your own graphics, text, and colors.
            </p>
          </motion.div>

          {/* Navigation Arrows */}
          {formattedMockups.length > 0 && !loading && (
            <motion.div variants={itemVariants} className=" gap-3 self-start md:self-end hidden sm:flex">
              <button
                onClick={() => handleScroll('left')}
                className="w-12 h-12 rounded-full border-[3px] border-black flex items-center justify-center bg-white text-black hover:bg-[#ff5500] hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[3px] active:translate-x-[3px] cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft size={22} strokeWidth={3} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-12 h-12 rounded-full border-[3px] border-black flex items-center justify-center bg-white text-black hover:bg-[#ff5500] hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[3px] active:translate-x-[3px] cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight size={22} strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </div>

        {/* Horizontal Swiper Container */}
        <motion.div variants={itemVariants} className='mb-16'>
          {loading ? (
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 md:px-0">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="snap-start shrink-0 w-[80vw] sm:w-[320px] lg:w-[360px]">
                  <CardSkeleton />
                </div>
              ))}
            </div>
          ) : formattedMockups.length > 0 ? (
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 md:px-0"
            >
              {formattedMockups.map((mockup) => (
                <div key={mockup.id} className="snap-start shrink-0 w-[80vw] sm:w-[320px] lg:w-[360px]">
                  <MockupCard mockup={mockup} />
                </div>
              ))}
            </div>
          ) : (
            /* Brutalist Coming Soon Block if empty */
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

        {/* View All Button */}
        <motion.div variants={itemVariants} className="text-center">
          <button
            onClick={() => navigate('/mockups')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white border-[3px] border-black font-black uppercase tracking-widest text-sm hover:bg-[#ff5500] hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] cursor-pointer"
          >
            View All Mockups
          </button>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default MockupSection;