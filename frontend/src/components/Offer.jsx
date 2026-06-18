import React from 'react'
import { useState, useEffect, useContext } from "react"
import { all_products } from "../assets/data"
import { ShoppingBag } from "lucide-react"
import { ShopContext } from "../context/ShopContenxt"
import { useNavigate } from 'react-router-dom';
import CardSkeleton from './CardSkeleton';

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
    <section className='relative w-full min-h-screen bg-[#0B0F19] text-white py-32 px-6 sm:px-10 overflow-hidden'>
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className='relative z-10 max-w-7xl mx-auto text-center'>
        <h2 className='text-4xl sm:text-5xl font-extrabold mb-6'>
          Flash <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-purple">Offers</span>
        </h2>

        <p className='text-gray-400 mb-12 text-lg sm:text-xl max-w-2xl mx-auto'>
          Exclusive drops and limited-time collections. Grab them before the clock runs out!
        </p>

        <div className='flex justify-center items-center gap-6 mb-16 text-center'>
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div
              key={unit}
              className='bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 w-24 sm:w-28 shadow-2xl'
            >
              <span className='block text-3xl sm:text-4xl font-bold text-primary'>
                {timeLeft[unit] ?? 0}
              </span>
              <span className='block mt-2 text-gray-400 capitalize text-sm font-medium'>
                {unit}
              </span>
            </div>
          ))}
        </div>

        {all_products.length === 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10'>
            {[...Array(displayCount)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10'>
            {all_products.slice(0, displayCount).map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)} // Added onClick here
                className='group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-2 hover:shadow-glow transition-all duration-500 cursor-pointer'
              >
                <div className='relative w-full h-72 flex items-center justify-center bg-white/10 p-6 rounded-b-[2.5rem] transition-transform duration-500 group-hover:scale-105'>
                  <img
                    src={product.image}
                    className='object-contain w-56 h-56 transition-transform duration-500 drop-shadow-2xl'
                  />
                </div>

                <div className='p-6 pt-8 text-left'>
                  <h3 className='text-lg font-bold mb-1 truncate text-white group-hover:text-primary transition-colors'>
                    {product.name}
                  </h3>

                  <p className='text-gray-400 text-sm mb-6 line-clamp-1'>
                    {product.description}
                  </p>

                  <div className='flex justify-between items-center'>
                    <span className='text-2xl font-extrabold text-white'>
                      ${product.price.toFixed(2)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click from bubbling to parent div
                        addToCart(product._id);
                      }}
                      className='flex items-center justify-center w-12 h-12 bg-primary hover:bg-[#d94f15] rounded-full text-white shadow-glow transition-all duration-300 hover:scale-110'
                    >
                      <ShoppingBag className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {displayCount < all_products.length && (
          <div className='text-center mt-10'>
            <button
              onClick={() => setDisplayCount(prevCount => Math.min(prevCount + 8, all_products.length))}
              className='px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1'
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