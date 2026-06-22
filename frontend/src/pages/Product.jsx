import React, { useContext, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContenxt';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Define Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const imageVariants = {
  hidden: { x: -40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const Product = () => {
  const { addToCart, all_products, token } = useContext(ShopContext);
  const { id } = useParams(); 
  const product = all_products.find((p) => p._id === id); 

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // Added state for the accordion
  const navigate = useNavigate();
  const location = useLocation();

  if (!product) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black">
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-xl font-black uppercase tracking-widest"
        >
          Product not found
        </motion.p>
      </section>
    );
  }

  const handleAddToCart = () => {
    // Redirect to login if no token, while passing current page URL to return to
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    // Context handles adding to cart
    addToCart(product._id, quantity, selectedSize);
    alert(`Added ${quantity} of ${product.name} (Size: ${selectedSize}) to the cart!`);
  }

  return (
    <section className="relative w-full min-h-screen bg-[#f9f9f6] text-black py-32 px-6 sm:px-10 font-sans overflow-hidden">
      
      <motion.div 
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-16"
      >
        
        {/* LEFT: IMAGE SECTION */}
        <motion.div variants={imageVariants} className="md:w-1/2 relative bg-[#e5e5e5] border border-black/10 aspect-[4/5] overflow-hidden group cursor-crosshair">
          
          {/* Top Left "Hover to Zoom" Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-black/80 z-10">
            <span className="w-3 h-4 border border-black/80 rounded-sm"></span> Hover to zoom
          </div>

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-125"
          />
        </motion.div>

        {/* RIGHT: CONTENT SECTION */}
        <motion.div variants={contentVariants} className="md:w-1/2 flex flex-col justify-start pt-2">
          
          {/* Title */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-2">
            {product.name}
          </motion.h1>

          {/* Price */}
          <motion.p variants={itemVariants} className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-[#ff5500]">
            ${Number(product.price).toFixed(2)}
          </motion.p>

          {/* Description */}
          <motion.p variants={itemVariants} className="font-mono text-xs sm:text-sm leading-relaxed mb-6 max-w-md text-black/90">
            {product.description || "450 GSM heavyweight organic cotton fabric. Structured oversized fit with dropped shoulders and thick ribbed collar. Raw edge hem detail. Made in Portugal."}
          </motion.p>

          {/* SIZES */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6">
            {(product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-10 sm:w-14 sm:h-12 flex items-center justify-center border-2 border-black font-bold text-lg sm:text-xl transition-colors
                ${selectedSize === size 
                  ? "bg-[#ff5500] text-black" 
                  : "bg-transparent text-black hover:bg-black/5"}`}
              >
                {size}
              </button>
            ))}
          </motion.div>

          {/* ADD TO CART BUTTON (Wrapped to protect Tailwind hover interactions) */}
          <motion.div variants={itemVariants} className="w-full max-w-md mb-10">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#ff5500] border-2 border-black py-4 font-bold text-lg sm:text-xl uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]"
            >
              Add to cart
            </button>
          </motion.div>

          {/* MATERIALS & CARE ACCORDION */}
          <motion.div variants={itemVariants} className="w-full max-w-md border-t-2 border-black pt-4">
            <div 
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="flex justify-between items-center font-bold mb-4 cursor-pointer hover:opacity-70 transition-opacity"
            >
              <span className="text-sm sm:text-base uppercase tracking-widest">Materials & Care</span>
              <motion.span 
                animate={{ rotate: isAccordionOpen ? 45 : 0 }} 
                transition={{ duration: 0.3 }}
                className="text-2xl leading-none inline-block"
              >
                +
              </motion.span>
            </div>
            
            {/* Animated Drawer */}
            <AnimatePresence>
              {isAccordionOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="font-mono text-xs sm:text-sm leading-relaxed text-black/80 pb-4">
                    <p>100% Organic Cotton.</p>
                    <p>Machine wash cold.</p>
                    <p>Do not bleach.</p>
                    <p>Tumble dry low.</p>
                    <p>Iron on low heat.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </motion.div>
      </motion.div>
    </section>
  );
}

export default Product;