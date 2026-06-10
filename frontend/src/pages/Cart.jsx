import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContenxt'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';



const Cart = () => {

  const { cartItems, all_products, addToCart, removeFromCart, getTotalCartAmount , url } = useContext(ShopContext)

  const navigate = useNavigate()
  const total = getTotalCartAmount()

  const cartProducts = Object.keys(cartItems)
    .map((id) => all_products.find((p) => p._id === id)) // Find product for each id
    .filter(Boolean) // Filter out any undefined products (if id not found in all_products)
    .map((product) => ({ ...product, quantity: cartItems[product._id] })); // Add quantity


  return (
   
   <section className='relative w-full min-h-screen bg-linear-to-r from-indigo-900
     via-purple-900 to-pink-950 text-white py-24 px-6 sm:px-10'>
      
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none'></div>
      <div className='relative z-10 max-w-6xl mx-auto'>
        <h2 className='text-4xl sm:text-5xl font-semibold mb-12 text-center'>Your Shopping Cart</h2>

        {cartProducts.length === 0 ? (
          <div className='text-center text-gray-300 mt-20 space-y-6'>
            <p className='text-xl'>Your cart is currently empty</p>
            <button onClick={() => navigate("/")}
              className='bg-linear-to-r from-cyan-500 to-blue-500 px-8 py-3 rounded-2xl
               text-white hover:opacity-90 transition-all'>
              Start Shopping Now
            </button>
          </div>
        ) : (

          <>
            <div className='space-y-6 mb-12'>
              {cartProducts.map((item) => (
                <div key={item._id} className='flex flex-col sm:flex-row items-center 
                justify-between bg-white/10 border border-white/20 backdrop-blur-md p-6 
                rounded-3xl shadow-lg hover:shadow-cyan-400/30 transition-all'>

                  <div className='flex items-center gap-6'>
                    <img src={url + '/images/'+ item.image}
                      className='w-24 h-24 object-contain rounded-xl' />
                    <div>
                      <h3 className='text-xl font-semibold'>{item.name}</h3>
                      <p className='text-gray-300 text-sm mt-1 line-clamp-1'>{item.description}</p>
                      <p className='text-cyan-400 text-lg font-bold mt-2'>{item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4 mt-6 sm:mt-10'>
                    <button onClick={() => removeFromCart(item._id)} className='bg-white/20 p-2
              rounded-full hover:bg-white/30 transition-all'>
                      <Minus className='w-6 h-6' />
                    </button>

                    <span className='text-lg font-semibold'>{item.quantity}</span>
                    <button onClick={() => addToCart(item._id)} className='bg-white/20 p-2 
            rounded-full hover:bg-white/30 transition-all'>
                      <Plus className='w-6 h-6' />
                    </button>

                    <button onClick={() => removeFromCart(item._id, true)}
                      className='bg-red-500/70 p-2 rounded-full hover:bg-red-600 
                   transition-all ml-4'>
                      <Trash2 className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className='bg-white/10 border-white/20 backdrop-blur-md p-8
                                rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6'>
              <div className='text-2xl font-bold'>
                Total:
                <span className='text-cyan-400 ml-3'>{total.toFixed(2)}</span>
              </div>

              <button onClick={() => navigate("/order")}
                    className='flex items-center gap-4 bg-linear-to-r from-indigo-500
                                    via-purple-500 to-pink-500 py-5 px-8 rounded-3xl
                                  font-bold text-lg hover:opacity-90 transition-all text-white shadow-xl'>
                <ShoppingBag className='w-6 h-6' />
                Proceed to Checkout
              </button>

            </div>
          </>
        )}
      </div>
    </section>
  )
};

export default Cart;