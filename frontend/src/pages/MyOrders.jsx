import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { ShopContext } from '../context/ShopContenxt';

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { url, token } = useContext(ShopContext)

  const fetchOrders = async () => {
    try {
      const res = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } })
      const data = res.data.data
      const ordersData = Array.isArray(data) ? data : [data]
      
      // Sort orders by date descending (optional, assuming newer orders should be on top)
      ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setOrders(ordersData)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setOrders([])
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchOrders()
  }, [token])

  if (loading) {
    return (
      <section className='min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black px-6 font-sans'>
        <h2 className='text-3xl font-black uppercase tracking-widest animate-pulse'>Loading Orders...</h2>
      </section>
    )
  }

  // Helper function to determine badge colors based on status
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'delivered') return 'bg-[#4ade80] text-white'; // Green
    if (s === 'canceled') return 'bg-red-600 text-white'; // Red
    return 'bg-[#ff5500] text-white'; // Orange for pending/shipped/processing
  }

  // Format date to match the image style (e.g., OCT 26, 2024)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  }

  return (
    <section className='bg-[#f9f9f6] min-h-screen px-4 sm:px-6 py-30 font-sans text-black'>
      <div className='max-w-7xl mx-auto'>
        
        <h1 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-10'>
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className='text-left font-bold text-xl uppercase tracking-widest text-black/50'>
            No Orders Yet.
          </p>
        ) : (
          <div className='flex flex-col gap-8'>
            {orders.map((order) => {
              const total = order.items?.reduce(
                (sum, item) => sum + (item.price * (item.quantity || 1)),
                0
              ) || 0;

              return (
                <div 
                  key={order._id} 
                  className='bg-white border-[4px] border-black p-6 flex flex-col justify-between'
                >
                  
                  {/* ORDER HEADER */}
                  <div className='flex flex-col sm:flex-row justify-between gap-4 mb-6 border-b-2 border-black/10 pb-6'>
                    {/* Left Column: Order ID & Status */}
                    <div className='flex flex-col gap-2'>
                      <h2 className='text-lg sm:text-xl font-black uppercase tracking-tight'>
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h2>
                      <div className='flex items-center gap-2 text-sm sm:text-base font-black uppercase'>
                        <span>Status:</span>
                        <span className={`px-2 py-0.5 text-xs tracking-widest ${getStatusBadge(order.status)}`}>
                          {order.status || 'Processing'}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Date & Total */}
                    <div className='flex flex-col gap-2 sm:text-right'>
                      <p className='text-sm sm:text-base font-bold uppercase text-black/60 tracking-tight'>
                        Date: {formatDate(order.date)}
                      </p>
                      <p className='text-sm sm:text-base font-black uppercase tracking-tight'>
                        Total: <span className='text-lg'>${total.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  {/* ORDER IMAGES GRID */}
                  <div className='flex flex-wrap gap-4'>
                    {order.items?.map((item, index) => (
                      <div 
                        key={`${item._id}-${index}`} 
                        className='w-24 h-28 sm:w-28 sm:h-32 bg-[#e5e5e5] border border-black/10 flex items-center justify-center p-2 relative group'
                      >
                        {/* Quantity Badge (Only shows if > 1) */}
                        {item.quantity > 1 && (
                          <div className='absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full z-10'>
                            x{item.quantity}
                          </div>
                        )}
                        
                        {item.image && (
                          <img 
                            src={item.image}
                            alt={item.name}
                            className='w-full h-full object-contain mix-blend-multiply'
                          />
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default MyOrders