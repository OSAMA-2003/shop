import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContenxt';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const { getTotalCartAmount, placeOrder, loading, cartItems, all_products, all_mockups, customMockups } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipCode: '', country: '', phone: ''
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    await placeOrder(formData); 
  };

  useEffect(() => {
    if (!loading && getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [loading, getTotalCartAmount, navigate]);

  // Map cart items for the summary box
  const cartProducts = Object.entries(cartItems || {})
    .map(([cartKey, qty]) => {
      const [id, size] = cartKey.split('_');
      const product = all_products.find((p) => p._id === id) 
                    || all_mockups.find((m) => m._id === id)
                    || (customMockups || []).find((cm) => cm._id === id);
      if (!product) return null;
      return { 
        ...product, 
        image: product.image || product.imageFront, 
        size: size || 'M', 
        quantity: qty, 
        cartKey 
      };
    })
    .filter(Boolean);

  // Calculate totals to match the reference image's structure
  const subtotal = getTotalCartAmount();
  const shipping = subtotal > 0 ? 10.00 : 0; // Standard $10 shipping
  const taxes = subtotal > 0 ? subtotal * 0.08 : 0; // Mock 8% tax
  const total = subtotal + shipping + taxes;

  return (
    <section className="min-h-screen bg-[#f9f9f6] text-black py-34 px-4 sm:px-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Progress Bar */}
        <div className="flex border-b-2 border-black/20 mb-10 text-xs sm:text-sm font-black uppercase tracking-widest overflow-x-auto whitespace-nowrap">
          <div className="text-black border-b-[4px] border-[#ff5500] pb-3 -mb-[3px] pr-6">
            1. Information
          </div>
          <div className="text-black/40 pb-3 pr-6 pl-6">
            2. Shipping
          </div>
          <div className="text-black/40 pb-3 pl-6">
            3. Payment
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: SHIPPING DETAILS FORM */}
          <div className="flex-1 w-full bg-white border-[3px] border-black p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-8">Shipping Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
              <div className="flex flex-col">
                <label className="text-xs font-black uppercase mb-1">First Name *</label>
                <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} type="text" placeholder="Enter your first name" 
                  className="p-3 border-2 border-black rounded-none outline-none focus:ring-2 focus:ring-[#ff5500] placeholder-black/40 font-medium" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-black uppercase mb-1">Last Name *</label>
                <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} type="text" placeholder="Enter your last name" 
                  className="p-3 border-2 border-black rounded-none outline-none focus:ring-2 focus:ring-[#ff5500] placeholder-black/40 font-medium" />
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-xs font-black uppercase mb-1">Email Address *</label>
              <input required name="email" value={formData.email} onChange={onChangeHandler} type="email" placeholder="you@example.com" 
                className="w-full p-3 border-2 border-black rounded-none outline-none focus:ring-2 focus:ring-[#ff5500] placeholder-black/40 font-medium" />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-xs font-black uppercase mb-1">Street Address *</label>
              <input required name="street" value={formData.street} onChange={onChangeHandler} type="text" placeholder="Enter street and number" 
                className="w-full p-3 border-2 border-black rounded-none outline-none focus:ring-2 focus:ring-[#ff5500] placeholder-black/40 font-medium" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
              <div className="flex flex-col">
                <label className="text-xs font-black uppercase mb-1">City *</label>
                <input required name="city" value={formData.city} onChange={onChangeHandler} type="text" placeholder="Enter city" 
                  className="p-3 border-2 border-black rounded-none outline-none focus:ring-2 focus:ring-[#ff5500] placeholder-black/40 font-medium" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-black uppercase mb-1">State*</label>
                {/* Changed to a select dropdown to match the image UI */}
                 <input required name="state" value={formData.state} onChange={onChangeHandler} type="text" placeholder="Enter state" 
                  className="p-3 border-2 border-black rounded-none outline-none focus:ring-2 focus:ring-[#ff5500] placeholder-black/40 font-medium" />
             
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
              <div className="flex flex-col">
                <label className="text-xs font-black uppercase mb-1">Zip / Postal Code *</label>
                <input required name="zipCode" value={formData.zipCode} onChange={onChangeHandler} type="text" placeholder="Enter zip code" 
                  className="p-3 border-2 border-black rounded-none outline-none focus:ring-2 focus:ring-[#ff5500] placeholder-black/40 font-medium" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-black uppercase mb-1">Country *</label>
                 <input required name="country" value={formData.country} onChange={onChangeHandler} type="text" placeholder="Enter country" 
                  className="p-3 border-2 border-black rounded-none outline-none focus:ring-2 focus:ring-[#ff5500] placeholder-black/40 font-medium" />
             
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <label className="text-xs font-black uppercase mb-1">Phone Number *</label>
              <input required name="phone" value={formData.phone} onChange={onChangeHandler} type="text" placeholder="Enter phone number" 
                className="w-full p-3 border-2 border-black rounded-none outline-none focus:ring-2 focus:ring-[#ff5500] placeholder-black/40 font-medium" />
            </div>

            {/* Save Information Checkbox */}
            <div className="flex items-center gap-3">
              <input type="checkbox" id="saveInfo" className="w-5 h-5 border-2 border-black rounded-none accent-black cursor-pointer" />
              <label htmlFor="saveInfo" className="text-sm font-medium cursor-pointer">Save this information for next time</label>
            </div>

          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="w-full lg:w-[420px] bg-white border-[3px] border-black p-6 sm:p-8 shrink-0">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-6">Order Summary</h2>
            
            {/* Items List */}
            <div className="space-y-4 mb-6 border-b-2 border-black pb-6">
              {cartProducts.map((item) => (
                <div key={item._id} className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-[#e5e5e5] border border-black/10 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-black uppercase text-xs leading-tight max-w-[150px]">{item.name}</p>
                      <p className="text-xs font-bold text-black/60 uppercase mt-1">(Size {item.size || 'M'})</p>
                    </div>
                  </div>
                  <p className="font-medium text-sm whitespace-nowrap">${Number(item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs sm:text-sm font-black uppercase mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium">${shipping.toFixed(2)} (Standard)</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes:</span>
                <span className="font-medium">${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg mt-4 border-t-2 border-black pt-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#ff5500] border-2 border-black py-4 font-black text-lg uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]">
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Order;