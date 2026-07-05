import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { ShopContext } from '../context/ShopContenxt';
import { useTranslation } from 'react-i18next';

const MyOrders = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, token } = useContext(ShopContext);
  const isRTL = i18n.language === 'ar';

  const fetchOrders = async () => {
    try {
      const res = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
      const data = res.data.data;
      const ordersData = Array.isArray(data) ? data : [data];

      ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));

      setOrders(ordersData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setOrders([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <section className='min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black px-6 font-sans'>
        <h2 className='text-3xl font-black uppercase tracking-widest animate-pulse'>
          {isRTL ? "جاري تحميل الطلبات..." : "Loading Orders..."}
        </h2>
      </section>
    );
  }

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'delivered') return 'bg-[#4ade80] text-white';
    if (s === 'canceled') return 'bg-red-600 text-white';
    return 'bg-[#ff5500] text-white';
  }

  const translateStatus = (status) => {
    const s = status?.toLowerCase() || '';
    if (isRTL) {
      if (s === 'delivered') return 'تم التوصيل';
      if (s === 'cancelled') return 'تم الإلغاء';
      if (s === 'shipped') return 'تم الشحن';
      return 'قيد المراجعة';
    }
    return status || 'Processing';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isRTL) {
      return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  }

  return (
    <section className='bg-[#f9f9f6] min-h-screen px-4 sm:px-6 py-30 font-sans text-black'>
      <div className='max-w-7xl mx-auto'>
        <h1 className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('profile.ordersTitle')}
        </h1>

        {orders.length === 0 ? (
          <p className={`font-bold text-xl uppercase tracking-widest text-black/50 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('profile.noOrders')}
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
                  <div className={`flex flex-col sm:flex-row justify-between gap-4 mb-6 border-b-2 border-black/10 pb-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                    {/* Left/Right Column: Order ID & Status */}
                    <div className={`flex flex-col gap-2 ${isRTL ? 'items-end' : 'items-start'}`}>
                      <h2 className='text-lg sm:text-xl font-black uppercase tracking-tight'>
                        {isRTL ? `طلب #${order._id.slice(-6).toUpperCase()}` : `Order #${order._id.slice(-6).toUpperCase()}`}
                      </h2>
                      <div className={`flex items-center gap-2 text-sm sm:text-base font-black uppercase ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span>{isRTL ? 'الحالة:' : 'Status:'}</span>
                        <span className={`px-2 py-0.5 text-xs tracking-widest ${getStatusBadge(order.status)}`}>
                          {translateStatus(order.status)}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm sm:text-base font-black uppercase mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span>{isRTL ? 'الدفع والتحويل:' : 'Payment:'}</span>
                        <span className={`px-2 py-0.5 text-xs tracking-widest border border-black ${order.payment ? 'bg-green-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-red-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'}`}>
                          {order.payment ? (isRTL ? 'تم التحقق' : 'Verified') : (isRTL ? 'قيد المراجعة' : 'Pending Verification')}
                        </span>
                      </div>
                    </div>

                    {/* Right/Left Column: Date & Total */}
                    <div className={`flex flex-col gap-2 ${isRTL ? 'sm:text-left' : 'sm:text-right'}`}>
                      <p className='text-sm sm:text-base font-bold uppercase text-black/60 tracking-tight'>
                        {isRTL ? 'التاريخ:' : 'Date:'} {formatDate(order.date)}
                      </p>
                      <p className='text-sm sm:text-base font-black uppercase tracking-tight'>
                        {isRTL ? 'الإجمالي:' : 'Total:'} <span className='text-lg text-[#ff5500]'>{total.toFixed(2)} EGP</span>
                      </p>
                    </div>
                  </div>

                  {/* ORDER IMAGES GRID */}
                  <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {order.items?.map((item, index) => {
                      const dispName = item['name_' + i18n.language] || item.name;
                      return (
                        <div
                          key={`${item._id}-${index}`}
                          className='w-24 h-28 sm:w-28 sm:h-32 bg-[#e5e5e5] border border-black/10 flex items-center justify-center p-2 relative group'
                        >
                          {/* Quantity Badge */}
                          {item.quantity > 1 && (
                            <div className={`absolute -top-2 bg-black text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full z-10 ${isRTL ? '-left-2' : '-right-2'}`}>
                              x{item.quantity}
                            </div>
                          )}

                          {item.image && (
                            <img
                              src={item.image}
                              alt={dispName}
                              className='w-full h-full object-contain mix-blend-multiply'
                            />
                          )}

                          {/* Size Badge */}
                          <div className={`absolute bottom-1 bg-black text-[#f9f9f6] text-[10px] font-black uppercase px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] z-10 ${isRTL ? 'right-1' : 'left-1'}`}>
                            {item.size || 'M'}
                          </div>

                          {item.isCustomMockup && (
                            <div className={`absolute top-1 bg-[#ff5500] text-black text-[8px] font-black uppercase px-1 py-0.5 border border-black z-10 ${isRTL ? 'right-1' : 'left-1'}`}>
                              {isRTL ? 'مخصص' : 'Custom'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyOrders;