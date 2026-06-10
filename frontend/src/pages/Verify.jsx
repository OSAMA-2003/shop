import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContenxt';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    
    const { url, token } = useContext(ShopContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            const response = await axios.post(`${url}/api/order/verify`, { success, orderId }, { headers: { token } });
            if (response.data.success) {
                navigate("/myorders"); // Successful payment, send them to their orders
            } else {
                navigate("/"); // Payment failed or cancelled
            }
        } catch (error) {
            console.log(error);
            navigate("/");
        }
    };

    useEffect(() => {
        if (token) {
            verifyPayment();
        }
    }, [token]); // Run when component loads or token becomes available

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-900">
            <div className="w-16 h-16 border-4 border-t-cyan-400 border-white/20 rounded-full animate-spin"></div>
        </div>
    );
}

export default Verify;