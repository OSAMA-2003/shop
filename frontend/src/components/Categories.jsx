import React, { useContext, useState } from 'react'
import { categories } from "../assets/data";
import { ShopContext } from '../context/ShopContenxt';
import { useNavigate } from 'react-router-dom';
import CardSkeleton from './CardSkeleton';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  // Set to 6 to load complete grid blocks (each block is 3 items)
  const [displayCount, setDisplayCount] = useState(6); 
  const { all_products } = useContext(ShopContext);
  const navigate = useNavigate();

  const filteredProducts =
    selectedCategory === "All"
      ? all_products
      : all_products.filter((p) => p.category === selectedCategory);

  return (
    <section className='relative w-full min-h-screen bg-[#f4f6f8] py-24 px-6 sm:px-10'>
      <div className='max-w-7xl mx-auto'>
        
        

        <h2 className='text-6xl sm:text-7xl font-black uppercase  text-center tracking-tighter mb-4 leading-none'>
            New  <span className="text-[#ff5500]">Arrivals</span>
          </h2>

        {/* Clean, Minimal Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`pb-1 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              selectedCategory === "All" 
                ? "border-black text-black" 
                : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            All
          </button>
          
          {categories.map((cat) => (
            <button 
              key={cat.name} 
              onClick={() => setSelectedCategory(cat.name)}
              className={`pb-1 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
                selectedCategory === cat.name 
                  ? "border-black text-black" 
                  : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Editorial Grid Layout */}
        {filteredProducts.length === 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 auto-rows-[350px] md:auto-rows-[350px] lg:auto-rows-[400px]'>
            {[...Array(displayCount)].map((_, index) => {
              const isLarge = index % 3 === 0;
              return (
                <div key={index} className={`h-full ${isLarge ? "md:row-span-2" : ""}`}>
                  <CardSkeleton />
                </div>
              );
            })}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 auto-rows-[350px] md:auto-rows-[350px] lg:auto-rows-[400px]'>
            {filteredProducts.slice(0, displayCount).map((product, index) => {
              
              // This logic creates the specific layout: Every 1st item out of 3 is large.
              const isLarge = index % 3 === 0;

              return (
                <div 
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className={`group relative overflow-hidden bg-gray-200 cursor-pointer ${
                    isLarge ? "md:row-span-2" : ""
                  }`}
                >
                  {/* Full coverage image */}
                  <img 
                    src={product.image}
                    alt={product.name}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                  
                  {/* Dark Gradient Overlay for text readability */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100'></div>
                  
                  {/* Overlay Text Content */}
                  <div className='absolute bottom-0 left-0 p-6 md:p-8 w-full text-white'>
                    <p className='text-xs font-bold uppercase tracking-widest text-gray-300 mb-1'>
                      {product.category}
                    </p>
                    
                    {/* Title scales based on whether it is the large card or small card */}
                    <h3 className={`font-black uppercase tracking-tight mb-2 leading-none ${
                      isLarge ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-xl md:text-2xl lg:text-3xl'
                    }`}>
                      {product.name}
                    </h3>
                    
                    <p className='text-sm md:text-base font-medium text-gray-200'>
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Load More Logic (Updates by 6 to maintain grid balance) */}
        {displayCount < filteredProducts.length && (
          <div className='text-center mt-12'>
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 6, filteredProducts.length))}
              className='px-10 py-4 bg-[#0a192f] text-white font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors duration-300'
            >
              Load More
            </button>
          </div>
        )}

      </div>
    </section>
  )
};

export default Categories;