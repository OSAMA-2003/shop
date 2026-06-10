import React from 'react'
import { useState, useEffect, useContext } from "react"
import { all_products } from "../assets/data"
import { ShoppingBag } from "lucide-react"
import { ShopContext } from "../context/ShopContenxt"
import { useNavigate } from 'react-router-dom';

const Offer = () => {
  const { addToCart } = useContext(ShopContext)
  const [timeLeft, setTimeLeft] = useState({})
  const [displayCount, setDisplayCount] = useState(8); // State to manage number of displayed products

  useEffect(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 5)

    const interval = setInterval(() => {
      const now = new Date()
      const diff = targetDate - now

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className='relative w-full min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10'>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none'></div>

      <div className='relative z-10 max-w-7xl mx-auto text-center'>
        <h2 className='text-4xl sm:text-5xl font-extrabold mb-6'>
          Our modern store
        </h2>

        <p className='text-gray-300 mb-12 text-lg sm:text-xl'>
          Discover the latest products and take advantage of the discounts before time runs out!
        </p>

        <div className='flex justify-center items-center gap-6 mb-16 text-center'>
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div
              key={unit}
              className='bg-white/10 backdrop-blur-md rounded-3xl p-6 w-24 sm:w-28 shadow-lg'
            >
              <span className='block text-3xl sm:text-4xl font-bold text-cyan-400'>
                {timeLeft[unit] ?? 0}
              </span>
              <span className='block mt-2 text-gray-200 capitalize'>
                {unit}
              </span>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10'>
          {all_products.slice(0, displayCount).map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)} // Added onClick here
              className='bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:scale-105 hover:shadow-cyan-400/30 transition-all duration-500'
            >
              <div className='relative w-full h-64 flex items-center justify-center bg-gradient-to-b from-purple-800/40 to-transparent'>
                <img
                  src={product.image}
                  className='object-contain w-56 h-56 hover:scale-110 transition-transform duration-500'
                />
              </div>

              <div className='p-5 text-left'>
                <h3 className='text-lg font-semibold mb-2 truncate cursor-pointer'>
                  {product.name}
                </h3>

                <p className='text-gray-300 text-sm mb-4 line-clamp-2'>
                  {product.description}
                </p>

                <div className='flex justify-between items-center'>
                  <span className='text-xl font-bold text-cyan-400'>
                    ${product.price.toFixed(2)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click from bubbling to parent div
                      addToCart(product._id);
                    }}
                    className='flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-700 px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all text-white shadow-lg'
                  >
                    <ShoppingBag className='w-5 h-5' />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayCount < all_products.length && (
          <div className='text-center mt-10'>
            <button
              onClick={() => setDisplayCount(prevCount => Math.min(prevCount + 8, all_products.length))}
              className='px-8 py-3 bg-cyan-400 hover:bg-cyan-500 text-white font-bold rounded-2xl shadow-xl transition-transform transform hover:scale-105'
            >
              Load More
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

export default Offer