import React, { useContext, useState } from 'react'
import {  categories } from "../assets/data";
import { ShoppingBag } from 'lucide-react';
import { ShopContext } from '../context/ShopContenxt';
import { useNavigate } from 'react-router-dom';

const Categories = () => {

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayCount, setDisplayCount] = useState(8); // State to manage number of displayed products
  const { addToCart , url , all_products } = useContext(ShopContext)


  const navigate = useNavigate(); // Add this line
  const filteredProducts =
    selectedCategory === "All"
      ? all_products
      : all_products.filter((p) => p.category === selectedCategory)

  return (
    <section className='relative w-full min-h-screen bg-linear-to-r from-indigo-900 via-purple-900
                      to-pink-900 text-white py-24 px-6 sm:px-10'>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'>
      </div>
      <div className='relative z-10 max-w-7xl mx-auto text-center'>
        <h2 className='text-4xl-wrap justify-center gap-6 mb-16'>
          Shop by Category

        </h2>
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-6 py-3 rounded-2xl 
                    font-semibold text-lg transition-all shadow-lg
                    ${selectedCategory === "All"
                ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-cyan-400/50 scale-105"
                : "bg-white/10 hover:bg-white/20 text-gray-200"
              }`}>
            All
          </button>
         
         {categories.map((cat) => (
            <button key={cat.name} onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-3 rounded-2xl 
                        font-semibold text-lg transition-all shadow-lg
                        ${selectedCategory === cat.name
                    ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-cyan-400/50 scale-105"
                    : "bg-white/10 hover:bg-white/20 text-gray-200"
                  }`}>
                    {cat.name}
            </button>
         ))}


        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10'>
          {filteredProducts.slice(0, displayCount).map((product) => (
            <div key={product._id}
                 onClick={() => navigate(`/product/${product._id}`)} // Added onClick here
                 className='bg-white/10 backdrop-blur-md border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:scale-105 hover:shadow-cyan-400/30
      transition-all duration-500'>
              <div className='relative w-full h-64 flex items-center justify-center bg-linear-to-b
        from-purple-800/40 to-transparent cursor-pointer'> {/* Removed onClick from here */}
                <img src={url + '/images/' + product.image}
                  className='object-contain w-56 h-56 hover:scale-105 
          transition-transform duration-500 '/>
              </div>
              <div className='p-5 text-left'>
                <h3 className='text-lg font-semibold mb-2 truncate'>
                  {product.name}  </h3>
                <p className='text-gray-300 text-sm mb-4 line-clamp-2'>
                  {product.description}
                </p>
                <div className='flex justify-between items-center '>
                  <span className='text-xl font-bold text-cyan-400'>
                    ${product.price.toFixed(2)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click from bubbling to parent div
                      addToCart(product._id);}} className='flex items-center gap-2 bg-linear-to-r
  from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 rounded-xl font-semibold 
  hover:opacity-90 transition-all text-white shadow-lg '>
                    <ShoppingBag className='w-5 h-5 ' />


                  </button>

                </div>

              </div>
            </div>

          ))}

        </div>

        {displayCount < filteredProducts.length && (
          <div className='text-center mt-10'>
            <button
              onClick={() => setDisplayCount(prevCount => Math.min(prevCount + 8, filteredProducts.length))}
              className='px-8 py-3 bg-cyan-400 hover:bg-cyan-500 text-white font-bold rounded-2xl shadow-xl transition-transform transform hover:scale-105'
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