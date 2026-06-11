import React, { useContext, useEffect, useState, useRef } from 'react';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasCalledVerify = useRef(false);

    const verifyPayment = async (authToken) => {
        if (!url) return;

        try {
            const response = await axios.post(
                `${url}/api/order/verify`,
                { success, orderId },
                { headers: { token: authToken } }
            );

            if (response.data?.success === true) {
                setVerified(true);
                setLoading(false);

                setTimeout(() => navigate("/myorders"), 1200);
            } else {
                setLoading(false);
                setError("Payment verification failed");

                setTimeout(() => navigate("/"), 1500);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            setError("Something went wrong");

            setTimeout(() => navigate("/"), 1500);
        }
    };

    useEffect(() => {
        // Ensure backend URL is loaded from context
        if (!url) return;

        const token = contextToken || localStorage.getItem("token");

        if (!orderId) {
            navigate("/");
            return;
        }

        if (!token) {
            setError("Session lost. Please login to verify payment.");
            setLoading(false);
            setTimeout(() => navigate("/login"), 2000);
            return;
        }

        if (!hasCalledVerify.current) {
            hasCalledVerify.current = true;
            verifyPayment(token);
        }
    }, [orderId, contextToken, success, url, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-900">
            
            {loading && (
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-cyan-400 border-white/20 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">Verifying your payment...</p>
                </div>
            )}

            {!loading && verified && (
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-400 mb-4">
                        Payment Verified!
                    </h2>
                    <p className="text-white">Redirecting to your orders...</p>
                </div>
            )}

            {!loading && error && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">
                        {error}
                    </h2>
                    <p className="text-white">Redirecting...</p>
                </div>
            )}
        </div>
    );
};

export default Verify;