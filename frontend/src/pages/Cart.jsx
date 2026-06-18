import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContenxt';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

// Custom variants for items entering and leaving the cart
const cartItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0, 
    x: 50, // Slides out to the right when removed
    transition: { duration: 0.3, ease: "easeIn" } 
  }
};

const Cart = () => {
  const { cartItems, all_products, addToCart, removeFromCart, getTotalCartAmount } = useContext(ShopContext)
  const navigate = useNavigate()
  
  const total = getTotalCartAmount()

  const cartProducts = Object.keys(cartItems)
    .map((id) => all_products.find((p) => p._id === id)) 
    .filter(Boolean) 
    .map((product) => ({ ...product, quantity: cartItems[product._id] })); 

  // Calculate total number of items for the header
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
        <motion.h1 variants={headerVariants} className='text-5xl sm:text-6xl font-black uppercase tracking-tighter mb-10'>
          Your Bag [{totalItemsCount}]
        </motion.h1>

        {cartProducts.length === 0 ? (
          <motion.div variants={itemVariants} className='text-left mt-20 space-y-6'>
            <p className='text-2xl font-black uppercase tracking-tight'>Your bag is currently empty.</p>
            <button 
              onClick={() => navigate("/")}
              className='bg-[#ff5500] border-2 border-black px-8 py-4 font-black uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <>
            {/* CART ITEMS LIST */}
            <div className='space-y-8 mb-10'>
              {/* AnimatePresence allows elements to animate out when removed from the DOM */}
              <AnimatePresence mode="popLayout">
                {cartProducts.map((item) => (
                  <motion.div 
                    layout // This makes surrounding items smoothly glide to fill the empty space
                    variants={cartItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key={item._id} 
                    className='flex items-start justify-between'
                  >
                    <div className='flex gap-4 sm:gap-6 w-full'>
                      {/* Image */}
                      <div className='w-24 h-28 sm:w-32 sm:h-36 bg-[#e5e5e5] border border-black/10 shrink-0 overflow-hidden'>
                        <img 
                          src={item.image}
                          alt={item.name}
                          className='w-full h-full object-cover mix-blend-multiply transition-transform duration-500 hover:scale-110' 
                        />
                      </div>
                      
                      {/* Details */}
                      <div className='flex flex-col justify-start pt-1 flex-1'>
                        <h3 className='text-lg sm:text-2xl font-black uppercase leading-[1.1] tracking-tight max-w-[250px] mb-1'>
                          {item.name}
                        </h3>
                        {/* Using a placeholder 'M' for size if your context doesn't store size yet */}
                        <p className='font-mono text-sm text-black/80 mb-1'>Size: {item.size || 'M'}</p>
                        <p className='text-lg sm:text-xl font-bold'>${Number(item.price).toFixed(2)}</p>
                      </div>

                      {/* Controls */}
                      <div className='flex items-start gap-2 sm:gap-3 pt-1'>
                        <button 
                          onClick={() => removeFromCart(item._id)} 
                          className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-black hover:bg-[#ff5500] hover:text-white transition-colors font-mono text-xl sm:text-2xl leading-none active:scale-90'
                        >
                          -
                        </button>

                        <span className='w-6 sm:w-8 text-center font-bold text-lg sm:text-xl leading-none pt-1 sm:pt-2'>
                          {item.quantity}
                        </span>

                        <button 
                          onClick={() => addToCart(item._id)} 
                          className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-black hover:bg-[#ff5500] hover:text-white transition-colors font-mono text-xl sm:text-2xl leading-none active:scale-90'
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* THICK DIVIDER */}
            <motion.div variants={itemVariants} className='w-full border-t-[6px] border-black my-8'></motion.div>

            {/* FOOTER: SUBTOTAL & CHECKOUT */}
            <motion.div variants={itemVariants} className='flex flex-col gap-8'>
              <div className='flex justify-between items-end'>
                <span className='text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none'>
                  Subtotal
                </span>
                {/* layout added to subtotal so it updates smoothly */}
                <motion.span layout className='text-4xl sm:text-5xl font-black text-[#ff5500] leading-none'>
                  ${total.toFixed(2)}
                </motion.span>
              </div>

              <button 
                onClick={() => navigate("/order")}
                className='w-full bg-[#ff5500] border-2 border-black py-5 font-black text-xl sm:text-2xl uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px]'
              >
                Checkout
              </button>
            </motion.div>
            
          </>
        )}
      </motion.div>
    </section>
  )
};

export default Cart;