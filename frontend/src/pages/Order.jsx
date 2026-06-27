import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContenxt';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import instapayQr from '../assets/instapay_qr.png';

const Order = () => {
  const { getTotalCartAmount, placeOrder, loading, cartItems, all_products, all_mockups, customMockups } = useContext(ShopContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Information/Shipping, 2 = Payment details and receipt upload
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipCode: '', country: '', phone: ''
  });
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Max size is 5MB.");
        return;
      }
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const form = e.target.closest('form');
    if (form && form.checkValidity()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (form) {
      form.reportValidity();
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!screenshotFile) {
      toast.error("Please upload a payment screenshot receipt to complete your order.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await placeOrder(formData, screenshotFile); 
      if (res && res.success) {
        navigate('/myorders');
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <div className={`pb-3 pr-6 ${step === 1 ? 'text-black border-b-[4px] border-[#ff5500] -mb-[3px]' : 'text-black/40'}`}>
            1. Shipping Address
          </div>
          <div className={`pb-3 pl-6 ${step === 2 ? 'text-black border-b-[4px] border-[#ff5500] -mb-[3px]' : 'text-black/40'}`}>
            2. Payment Verification
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Shipping details OR Payment details */}
          {step === 1 ? (
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
                  <label className="text-xs font-black uppercase mb-1">State *</label>
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
          ) : (
            <div className="flex-1 w-full bg-white border-[3px] border-black p-6 sm:p-10">
              <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Payment Details</h2>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-black text-[#ff5500] hover:bg-[#ff5500] hover:text-black border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  ← Edit Address
                </button>
              </div>

              <p className="text-sm font-bold text-black/60 mb-8 uppercase leading-relaxed">
                Please transfer the total amount to one of our accounts listed below, then upload the transaction receipt screenshot.
              </p>

              {/* Payment Details Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Vodafone Cash Card */}
                <div className="border-[3px] border-black p-5 bg-[#F5F2EB] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                  <div>
                    <span className="bg-[#E60000] text-white text-[10px] font-black uppercase px-3 py-1 border-2 border-black">
                      Vodafone Cash
                    </span>
                    <h3 className="text-base font-black uppercase tracking-tight mt-4">Wallet Number</h3>
                    <p className="font-mono text-xl font-bold mt-1 text-black select-all bg-white p-2 border border-black/20">01098765432</p>
                  </div>
                  <p className="text-[10px] font-bold text-black/40 uppercase mt-4">
                    Transfer from any mobile wallet
                  </p>
                </div>

                {/* Instapay Card */}
                <div className="border-[3px] border-black p-5 bg-[#F5F2EB] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                  <div>
                    <span className="bg-[#005bb7] text-white text-[10px] font-black uppercase px-3 py-1 border-2 border-black">
                      Instapay
                    </span>
                    <h3 className="text-base font-black uppercase tracking-tight mt-4">Instapay Address</h3>
                    <p className="font-mono text-xl font-bold mt-1 text-black select-all bg-white p-2 border border-black/20">osama@instapay</p>
                  </div>
                  <p className="text-[10px] font-bold text-black/40 uppercase mt-4">
                    Instant bank transfer
                  </p>
                </div>
              </div>

              {/* Instapay QR Code Display */}
              <div className="border-[3px] border-black p-6 mb-8 flex flex-col items-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xs font-black uppercase tracking-widest text-black/50 mb-4">
                  Instapay QR Code
                </h3>
                <div className="w-48 h-48 border-2 border-black p-2 bg-white relative">
                  <img
                    src={instapayQr}
                    alt="Instapay QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[10px] font-black uppercase text-black/60 mt-3 text-center tracking-tight">
                  Scan QR with your Instapay App to pay instantly
                </p>
              </div>

              {/* Upload Screenshot Area */}
              <div className="border-[3px] border-black p-6 bg-[#f9f9f6]">
                <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4">
                  Upload Payment Screenshot *
                </h3>
                
                <div 
                  onClick={() => document.getElementById('payment-screenshot-input').click()}
                  className="border-2 border-black border-dashed rounded-none p-8 text-center cursor-pointer hover:bg-black/5 transition-colors flex flex-col items-center justify-center min-h-[160px]"
                >
                  <input
                    id="payment-screenshot-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {!screenshotPreview ? (
                    <>
                      <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
                        <span className="font-black text-xl">+</span>
                      </div>
                      <p className="text-xs font-black uppercase tracking-tight text-black">
                        Click to select payment receipt screenshot
                      </p>
                      <p className="text-[10px] font-bold text-black/50 uppercase mt-1">
                        Supports JPEG, PNG, WEBP (Max 5MB)
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-40 h-40 border-2 border-black overflow-hidden bg-white mb-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <img 
                          src={screenshotPreview} 
                          alt="Screenshot receipt preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs font-black uppercase text-green-600 tracking-wider">
                        ✓ Receipt Screenshot Loaded
                      </p>
                      <p className="text-[10px] font-bold text-black/40 mt-1 uppercase">
                        Click to change image
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: ORDER SUMMARY */}
          <div className="w-full lg:w-[420px] bg-white border-[3px] border-black p-6 sm:p-8 shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-6">Order Summary</h2>
            
            {/* Items List */}
            <div className="space-y-4 mb-6 border-b-2 border-black pb-6">
              {cartProducts.map((item) => (
                <div key={item.cartKey || item._id} className="flex justify-between items-start gap-4">
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

            {step === 1 ? (
              <button 
                type="button" 
                onClick={handleProceedToPayment}
                className="w-full bg-[#ff5500] border-2 border-black py-4 font-black text-lg uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Payment
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#ff5500] border-2 border-black py-4 font-black text-lg uppercase tracking-widest text-black hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 text-black" />
                    Placing Order...
                  </>
                ) : (
                  'Submit Order'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default Order;