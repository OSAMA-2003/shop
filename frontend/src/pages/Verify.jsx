import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContenxt';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    
    const { url, token: contextToken } = useContext(ShopContext);
    const navigate = useNavigate();
    const [verified, setVerified] = useState(false);

    const verifyPayment = async (authToken) => {
        try {
            const response = await axios.post(`${url}/api/order/verify`, { success, orderId }, { headers: { token: authToken } });
            if (response.data.success) {
                setVerified(true);
                setTimeout(() => navigate("/myorders"), 1000); // Give a moment to show success
            } else {
                setTimeout(() => navigate("/"), 1000);
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => navigate("/"), 1000);
        }
    };

    useEffect(() => {
        // Try to get token from context or localStorage
        const token = contextToken || localStorage.getItem('token');
        
        if (token && orderId) {
            verifyPayment(token);
        } else if (!token) {
            // If no token available, redirect to login
            navigate("/login");
        }
    }, [orderId, contextToken]); // Run when orderId or contextToken changes

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-900">
            {verified ? (
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-400 mb-4">Payment Verified!</h2>
                    <p className="text-white">Redirecting to your orders...</p>
                </div>
            ) : (
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-cyan-400 border-white/20 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">Verifying your payment...</p>
                </div>
            )}
        </div>
    );
}

export default Verify;