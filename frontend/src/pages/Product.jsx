import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContenxt'

const Product = () => {
  const { addToCart, all_products, url } = useContext(ShopContext)
  const { id } = useParams() 
  const product = all_products.find((p) => p._id === id) 

  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black">
        <p className="text-xl font-black uppercase tracking-widest">Product not found</p>
      </section>
    )
  }

  const handleAddToCart = () => {
    // Make sure your context handles size if you need it: addToCart(product._id, selectedSize, quantity)
    addToCart(product._id, quantity)
    alert(`Added ${quantity} of ${product.name} (Size: ${selectedSize}) to the cart!`)
  }

  return (
    <section className="relative w-full min-h-screen bg-[#f9f9f6] text-black py-20 px-6 sm:px-10 font-sans">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-16">
        
        {/* LEFT: IMAGE SECTION */}
        <div className="md:w-1/2 relative bg-[#e5e5e5] border border-black/10 aspect-[4/5] overflow-hidden group cursor-crosshair">
          
          {/* Top Left "Hover to Zoom" Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-black/80 z-10">
            <span className="w-3 h-4 border border-black/80 rounded-sm"></span> Hover to zoom
          </div>

          <img
            src={url + '/images/' + product.image}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-125"
          />
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div className="md:w-1/2 flex flex-col justify-start pt-2">
          
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-2">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            ${Number(product.price).toFixed(2)}
          </p>

          {/* Description (Monospace like the image) */}
          <p className="font-mono text-xs sm:text-sm leading-relaxed mb-6 max-w-md text-black/90">
            {product.description || "450 GSM heavyweight organic cotton fabric. Structured oversized fit with dropped shoulders and thick ribbed collar. Raw edge hem detail. Made in Portugal."}
          </p>

          {/* SIZES */}
          <div className="flex gap-2 mb-6">
            {["S", "M", "L", "XL"].map((size) => (
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
          </div>

          {/* ADD TO CART BUTTON */}
          <button
            onClick={handleAddToCart}
            className="w-full max-w-md bg-[#ff5500] border-2 border-black py-4 font-bold text-lg sm:text-xl uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors mb-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]"
          >
            Add to cart
          </button>

          {/* MATERIALS & CARE ACCORDION */}
          <div className="w-full max-w-md border-t-2 border-black pt-4">
            <div className="flex justify-between items-center font-bold mb-4 cursor-pointer hover:opacity-70 transition-opacity">
              <span className="text-sm sm:text-base uppercase tracking-widest">Materials & Care</span>
              <span className="text-xl leading-none">+</span>
            </div>
            
            <div className="font-mono text-xs sm:text-sm leading-relaxed text-black/80">
              <p>100% Organic Cotton.</p>
              <p>Machine wash cold.</p>
              <p>Do not bleach.</p>
              <p>Tumble dry low.</p>
              <p>Iron on low heat.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Product