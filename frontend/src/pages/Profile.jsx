import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContenxt';
import { Loader2, User, Mail, Package, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { url, token } = useContext(ShopContext);
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
      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
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
      <section className='min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white px-6'>
        <Loader2 className='w-16 h-16 animate-spin text-cyan-400 mb-4' />
        <h2 className='text-xl font-semibold'>Loading Profile...</h2>
      </section>
    );
  }

  return (
    <section className='bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 min-h-screen px-6 py-24'>
      <div className='max-w-6xl mx-auto space-y-10'>
        
        {/* User Profile Card */}
        <div className='bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-white/10'>
          <div className='bg-linear-to-r from-cyan-400 to-blue-500 p-4 rounded-full shadow-lg'>
            <User className='w-16 h-16 text-white' />
          </div>
          <div className='text-center sm:text-left text-white flex-1'>
            <h1 className='text-3xl font-bold mb-2'>{userData.name}</h1>
            <div className='flex items-center justify-center sm:justify-start gap-2 text-gray-300'>
              <Mail className='w-5 h-5' />
              <p>{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <div className='flex items-center gap-3 mb-6 mt-12'>
            <Package className='w-8 h-8 text-cyan-400' />
            <h2 className='text-3xl font-bold text-white'>My Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className='bg-white/5 backdrop-blur-md rounded-3xl p-10 text-center border border-white/10'>
              <p className='text-gray-300 text-xl'>You haven't placed any orders yet.</p>
              <button onClick={() => navigate("/")} className='mt-6 bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg'>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {orders.map((order) => {
                const total = order.items?.reduce(
                  (sum, item) => sum + (item.price * (item.quantity || 1)), 0
                ) || 0;
                
                return (
                  <div key={order._id} className='bg-linear-to-b from-purple-800 to-transparent rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:scale-105 transform transition-all duration-300 border border-white/10'>
                    <div>
                      <div className='flex justify-between items-center mb-4'>
                        <h3 className='text-lg font-bold text-cyan-400'>
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        <span className='text-sm text-gray-300'>
                          {order.items?.length || 0} item(s)
                        </span>
                      </div>

                      <div className='space-y-3 mb-6'>
                        {order.items?.map((item) => (
                          <div key={item._id} className='flex justify-between items-center bg-white/5 p-3 rounded-lg'>
                            <div className='flex items-center gap-3'>
                              {item.image && (
                                <img src={`${url}/images/${item.image}`} className='w-10 h-10 object-cover rounded-md' alt={item.name} />
                              )}
                              <p className='text-sm text-white font-medium line-clamp-1'>
                                {item.name} <span className='text-gray-400'>x{item.quantity || 1}</span>
                              </p>
                            </div>
                            <p className='font-bold text-white'>
                              ${item.price * (item.quantity || 1)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                      <span className={`flex items-center gap-1.5 font-semibold text-sm
                        ${order.status === "delivered" ? "text-green-400" : order.status === "pending" ? "text-yellow-400" : "text-red-400"} `} >
                        {order.status === "delivered" && <CheckCircle className='w-4 h-4' />}
                        {order.status === "pending" && <Loader2 className='w-4 h-4 animate-spin' />}
                        {order.status === "canceled" && <XCircle className='w-4 h-4' />}
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                      <span className='font-bold text-lg text-white'>
                        Total: ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Profile;