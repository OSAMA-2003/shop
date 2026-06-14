import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContenxt';
import { User, Mail, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { url, token, setToken } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default placeholders. 
  // TODO: If you create a backend endpoint like /api/user/profile, fetch and set the data here!
  const [userData, setUserData] = useState({
    name: 'My Profile',
    email: 'user@example.com'
  });

  const fetchOrders = async () => {
    try {
      const res = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
      const data = res.data.data;
      const ordersData = Array.isArray(data) ? data : [data];
      
      // Sort orders by newest first
      ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setOrders(ordersData);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token, navigate, url]);

  if (loading) {
    return (
      <section className='min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black px-6 font-sans'>
        <h2 className='text-3xl font-black uppercase tracking-widest animate-pulse'>Loading Profile...</h2>
      </section>
    );
  }

  // Helper function to determine badge colors based on status
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'delivered') return 'bg-[#4ade80] text-white border-2 border-black'; // Green
    if (s === 'canceled') return 'bg-red-600 text-white border-2 border-black'; // Red
    return 'bg-[#ff5500] text-black border-2 border-black'; // Orange for pending/shipped
  };

  // Format date to match the brutalist image style (e.g., OCT 26, 2024)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/");
  };

  return (
    <section className='bg-[#f9f9f6] min-h-screen px-4 sm:px-3 py-30 font-sans text-black'>
      <div className='max-w-7xl mx-auto space-y-16'>
        
        {/* USER PROFILE CARD */}
        <div className='bg-white border-[4px] border-black p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
          <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
            {/* Avatar Block */}
            <div className='w-24 h-24 bg-[#ff5500] border-[3px] border-black flex items-center justify-center shrink-0'>
              <User className='w-12 h-12 text-black' strokeWidth={3} />
            </div>
            
            {/* User Info */}
            <div className='text-center sm:text-left flex-1 pt-2'>
              <h1 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-2 leading-none'>
                {userData.name}
              </h1>
              <div className='flex items-center justify-center sm:justify-start gap-2 font-mono text-sm sm:text-base text-black/80 mt-4'>
                <Mail className='w-5 h-5' strokeWidth={2} />
                <p>{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout} 
            className='bg-white border-2 border-black px-6 py-3 font-black uppercase tracking-widest text-black flex items-center gap-2 hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
          >
            <LogOut className='w-5 h-5' strokeWidth={2.5} />
            Log Out
          </button>
        </div>

        {/* ORDERS SECTION */}
        <div>
          {/* Heavy Section Header */}
          <div className='border-b-[6px] border-black pb-4 mb-10'>
            <h2 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter'>
              My Orders
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className='bg-white border-[4px] border-black p-10 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'>
              <p className='text-2xl font-black uppercase tracking-tight mb-8'>No orders found.</p>
              <button 
                onClick={() => navigate("/")} 
                className='bg-[#ff5500] border-2 border-black px-8 py-4 font-black uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className='flex flex-col gap-10'>
              {orders.map((order) => {
                const total = order.items?.reduce(
                  (sum, item) => sum + (item.price * (item.quantity || 1)), 0
                ) || 0;
                
                return (
                  <div 
                    key={order._id} 
                    className='bg-white border-[4px] border-black p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                  >
                    
                    {/* ORDER HEADER */}
                    <div className='flex flex-col sm:flex-row justify-between gap-4 mb-6 border-b-[3px] border-black pb-6'>
                      {/* Left Column: Order ID & Status */}
                      <div className='flex flex-col gap-3'>
                        <h3 className='text-xl sm:text-2xl font-black uppercase tracking-tight leading-none'>
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        <div className='flex items-center gap-2 text-sm sm:text-base font-black uppercase'>
                          <span>Status:</span>
                          <span className={`px-3 py-1 text-xs tracking-widest ${getStatusBadge(order.status)}`}>
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
                          Total: <span className='text-xl sm:text-2xl'>${total.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>

                    {/* ORDER IMAGES GRID */}
                    <div className='flex flex-wrap gap-4'>
                      {order.items?.map((item, index) => (
                        <div 
                          key={`${item._id}-${index}`} 
                          className='w-24 h-28 sm:w-28 sm:h-32 bg-[#e5e5e5] border-2 border-black flex items-center justify-center p-2 relative group'
                        >
                          {/* Brutalist Quantity Badge */}
                          {item.quantity > 1 && (
                            <div className='absolute -top-3 -right-3 bg-black text-[#ff5500] border-2 border-black text-xs font-black w-8 h-8 flex items-center justify-center z-10'>
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
      </div>
    </section>
  );
}

export default Profile;