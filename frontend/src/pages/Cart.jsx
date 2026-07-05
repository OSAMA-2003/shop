import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContenxt';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// 1. Define Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const cartItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit: (isRTL) => ({
    opacity: 0,
    x: isRTL ? -50 : 50,
    transition: { duration: 0.3, ease: "easeIn" }
  })
};

const Cart = () => {
  const { t, i18n } = useTranslation();
  const { cartItems, all_products, all_mockups, customMockups, addToCart, removeFromCart, getTotalCartAmount } = useContext(ShopContext);
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const total = getTotalCartAmount();

  const cartProducts = Object.entries(cartItems || {})
    .map(([cartKey, qty]) => {
      const [id, size] = cartKey.split('_');
      const product = all_products.find((p) => p._id === id)
        || all_mockups.find((m) => m._id === id)
        || (customMockups || []).find((cm) => cm._id === id);
      if (!product) return null;
      return {
        ...product,
        image: product.image || product.imageFront,
        size: size || 'M',
        quantity: qty,
        cartKey
      };
    })
    .filter(Boolean);

  const totalItemsCount = cartProducts.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <section className='relative w-full min-h-screen bg-[#f9f9f6] text-black pt-40 pb-10 px-6 sm:px-10 font-sans overflow-hidden'>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='max-w-3xl mx-auto'
      >
        {/* HEADER */}
        <motion.h1 variants={headerVariants} className={`text-5xl sm:text-6xl font-black uppercase tracking-tighter mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? `حقيبتك [${totalItemsCount}]` : `Your Bag [${totalItemsCount}]`}
        </motion.h1>

        {cartProducts.length === 0 ? (
          <motion.div variants={itemVariants} className={`mt-20 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className='text-2xl font-black uppercase tracking-tight'>{t('cart.empty')}</p>
            <button
              onClick={() => navigate("/")}
              className='bg-[#ff5500] border-2 border-black px-8 py-4 font-black uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] cursor-pointer'
            >
              {t('cart.shopNow')}
            </button>
          </motion.div>
        ) : (
          <>
            {/* CART ITEMS LIST */}
            <div className='space-y-8 mb-10'>
              <AnimatePresence mode="popLayout">
                {cartProducts.map((item) => {
                  const dispName = item['name_' + i18n.language] || item.name;
                  return (
                    <motion.div
                      layout
                      custom={isRTL}
                      variants={cartItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      key={item.cartKey}
                      className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`flex gap-4 sm:gap-6 w-full ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                        {/* Image */}
                        <div className='w-24 h-28 sm:w-32 sm:h-36 bg-[#e5e5e5] border border-black/10 shrink-0 overflow-hidden'>
                          <img
                            src={item.image}
                            alt={dispName}
                            className='w-full h-full object-cover mix-blend-multiply transition-transform duration-500 hover:scale-110'
                          />
                        </div>

                        {/* Details */}
                        <div className='flex flex-col justify-start pt-1 flex-1'>
                          <h3 className={`text-lg sm:text-2xl font-black uppercase leading-[1.1] tracking-tight max-w-[250px] mb-1 ${isRTL ? 'ml-auto' : ''}`}>
                            {dispName}
                          </h3>
                          <p className='font-mono text-sm text-black/80 mb-1'>
                            {t('cart.sizeLabel')}: {item.size || 'M'}
                          </p>
                          <p className='text-lg sm:text-xl font-bold'>
                            {Number(item.price).toFixed(2)} EGP
                          </p>
                        </div>

                        {/* Controls */}
                        <div className={`flex items-start gap-2 sm:gap-3 pt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <button
                            onClick={() => removeFromCart(item.cartKey)}
                            className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-black hover:bg-[#ff5500] hover:text-white transition-colors font-mono text-xl sm:text-2xl leading-none active:scale-90 cursor-pointer'
                          >
                            -
                          </button>

                          <span className='w-6 sm:w-8 text-center font-bold text-lg sm:text-xl leading-none pt-1 sm:pt-2'>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => addToCart(item._id, 1, item.size)}
                            className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-black hover:bg-[#ff5500] hover:text-white transition-colors font-mono text-xl sm:text-2xl leading-none active:scale-90 cursor-pointer'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* THICK DIVIDER */}
            <motion.div variants={itemVariants} className='w-full border-t-[6px] border-black my-8'></motion.div>

            {/* FOOTER: SUBTOTAL & CHECKOUT */}
            <motion.div variants={itemVariants} className='flex flex-col gap-8'>
              <div className={`flex justify-between items-end ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className='text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none'>
                  {t('cart.total')}
                </span>
                <motion.span layout className='text-4xl sm:text-5xl font-black text-[#ff5500] leading-none'>
                  {total.toFixed(2)} EGP
                </motion.span>
              </div>

              <button
                onClick={() => navigate("/order")}
                className='w-full bg-[#ff5500] border-2 border-black py-5 font-black text-xl sm:text-2xl uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] cursor-pointer'
              >
                {t('cart.checkout')}
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </section>
  );
};

export default Cart;