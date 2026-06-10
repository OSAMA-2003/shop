import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContenxt';
import { useNavigate } from 'react-router-dom';

const Order = () => {
    const { getTotalCartAmount, placeOrder, loading } = useContext(ShopContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipCode: '', country: '', phone: ''
    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault(); // Very important: prevents page reload
        await placeOrder(formData); // Call Stripe checkout from context
    };

    useEffect(() => {
        // Redirect back to cart if the cart is empty
        if (!loading && getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [loading, getTotalCartAmount, navigate]);

    return (
        <section className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-950 py-24 px-6 text-white">
            <form onSubmit={onSubmitHandler} className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10">
                
                {/* Delivery Information Form */}
                <div className="flex-1 bg-white/10 p-8 rounded-3xl backdrop-blur-md">
                    <h2 className="text-3xl font-bold mb-6">Delivery Information</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} type="text" placeholder="First Name" className="p-3 bg-white/20 rounded-xl outline-none placeholder-gray-300" />
                        <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} type="text" placeholder="Last Name" className="p-3 bg-white/20 rounded-xl outline-none placeholder-gray-300" />
                    </div>
                    <input required name="email" value={formData.email} onChange={onChangeHandler} type="email" placeholder="Email Address" className="w-full p-3 mb-4 bg-white/20 rounded-xl outline-none placeholder-gray-300" />
                    <input required name="street" value={formData.street} onChange={onChangeHandler} type="text" placeholder="Street" className="w-full p-3 mb-4 bg-white/20 rounded-xl outline-none placeholder-gray-300" />
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input required name="city" value={formData.city} onChange={onChangeHandler} type="text" placeholder="City" className="p-3 bg-white/20 rounded-xl outline-none placeholder-gray-300" />
                        <input required name="state" value={formData.state} onChange={onChangeHandler} type="text" placeholder="State" className="p-3 bg-white/20 rounded-xl outline-none placeholder-gray-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input required name="zipCode" value={formData.zipCode} onChange={onChangeHandler} type="text" placeholder="Zip Code" className="p-3 bg-white/20 rounded-xl outline-none placeholder-gray-300" />
                        <input required name="country" value={formData.country} onChange={onChangeHandler} type="text" placeholder="Country" className="p-3 bg-white/20 rounded-xl outline-none placeholder-gray-300" />
                    </div>
                    <input required name="phone" value={formData.phone} onChange={onChangeHandler} type="text" placeholder="Phone" className="w-full p-3 bg-white/20 rounded-xl outline-none placeholder-gray-300" />
                </div>

                {/* Cart Totals */}
                <div className="md:w-1/3 bg-white/10 p-8 rounded-3xl backdrop-blur-md h-fit">
                    <h2 className="text-2xl font-bold mb-6">Cart Totals</h2>
                    <div className="flex justify-between mb-4">
                        <p>Subtotal</p>
                        <p>${getTotalCartAmount().toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between mb-4">
                        <p>Delivery Fee</p>
                        <p>$2.00</p>
                    </div>
                    <hr className="border-white/20 mb-4" />
                    <div className="flex justify-between mb-8 font-bold text-xl text-cyan-400">
                        <p>Total</p>
                        <p>${(getTotalCartAmount() + 2).toFixed(2)}</p>
                    </div>
                    <button type="submit" className="w-full bg-linear-to-r from-cyan-500 to-blue-500 py-4 rounded-2xl font-bold hover:opacity-90 transition-all">
                        Confirm Order & Pay
                    </button>
                </div>
            </form>
        </section>
    );
}

export default Order;