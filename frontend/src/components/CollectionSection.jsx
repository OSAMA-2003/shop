import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContenxt';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CardSkeleton from './CardSkeleton';
import { useTranslation } from 'react-i18next';

// 1. Define Animation Variants
const headerVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const CollectionSection = () => {
  const { t, i18n } = useTranslation();
  const [displayCount, setDisplayCount] = useState(6);
  const { all_products, loading } = useContext(ShopContext);
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  // Safely fallback to empty array if all_products is undefined
  const filteredProducts = all_products || [];

  return (
    <section className='relative w-full min-h-screen bg-[#f4f6f8] py-24 px-6 sm:px-10 overflow-hidden'>
      <div className='max-w-7xl mx-auto'>

        {/* Animated Heading */}
        <motion.h2
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          className='text-6xl sm:text-7xl font-black uppercase text-center tracking-tighter mb-4 leading-none'
        >
          {t('collection.title')} <span className="text-[#ff5500]">{t('collection.accentTitle')}</span>
        </motion.h2>

        {/* Editorial Grid Layout or Coming Soon State */}
        <AnimatePresence mode="wait">
          {loading ? (
            /* Skeleton Loading State */
            <motion.div
              key="skeleton-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='grid grid-cols-1 md:grid-cols-2 gap-16 mb-12 auto-rows-[350px] md:auto-rows-[350px] lg:auto-rows-[400px]'
            >
              {[...Array(3)].map((_, index) => {
                const isLarge = index % 3 === 0;
                return (
                  <div key={index} className={`w-full h-full ${isLarge ? "md:row-span-2" : ""}`}>
                    <CardSkeleton />
                  </div>
                );
              })}
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            /* Coming Soon State */
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full py-32 flex flex-col items-center justify-center text-center border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black">
                {isRTL ? <>قريباً <span className="text-[#ff5500]">جداً</span></> : <>Coming <span className="text-[#ff5500]">Soon</span></>}
              </h3>
              <p className="mt-4 text-sm md:text-base font-bold uppercase tracking-widest text-gray-500">
                {t('collection.comingSoon')}
              </p>
            </motion.div>
          ) : (
            /* Product Grid */
            <motion.div
              key="product-grid"
              variants={gridContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 auto-rows-[350px] md:auto-rows-[350px] lg:auto-rows-[400px]'
            >
              <AnimatePresence>
                {filteredProducts.slice(0, displayCount).map((product, index) => {
                  const isLarge = index % 3 === 0;
                  const dispName = product['name_' + i18n.language] || product.name;

                  return (
                    <motion.div
                      layout
                      variants={cardVariants}
                      key={product._id}
                      onClick={() => navigate(`/product/${product._id}`)}
                      className={`group relative overflow-hidden bg-gray-200 cursor-pointer shadow-md hover:shadow-xl transition-shadow ${isLarge ? "md:row-span-2" : ""}`}
                    >
                      {/* Full coverage image */}
                      <img
                        src={product.image}
                        alt={dispName}
                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                      />

                      {/* Dark Gradient Overlay */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100'></div>

                      {/* Overlay Text Content */}
                      <div className={`absolute bottom-0 p-6 md:p-8 w-full text-white ${isRTL ? 'right-0 text-right' : 'left-0 text-left'}`}>
                        {/* Title */}
                        <h3 className={`font-black uppercase tracking-tight mb-2 leading-none ${isLarge ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-xl md:text-2xl lg:text-3xl'}`}>
                          {dispName}
                        </h3>

                        <p className='text-sm md:text-base font-medium text-[#ff5500] drop-shadow-md'>
                          {Number(product.price).toFixed(2)} EGP
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Collection Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          className='text-center mt-20'
        >
          <button
            onClick={() => navigate('/collection')}
            className='px-10 py-4 bg-black text-white border-[2px] border-black font-bold uppercase tracking-widest text-sm hover:bg-[#ff5500] transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] cursor-pointer'
          >
            {isRTL ? 'عرض كل المعروضات' : 'View All Collection'}
          </button>
        </motion.div>

      </div>
    </section>
  )
};

export default CollectionSection;
