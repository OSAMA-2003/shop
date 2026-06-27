import React, { useState, useEffect } from 'react';
import { Loader2, Download } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import JSZip from 'jszip';

const Orders = () => {
    const url = "https://shop-2-ms77.onrender.com";

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [updatingPaymentId, setUpdatingPaymentId] = useState(null);
    const [downloadingZipItemId, setDownloadingZipItemId] = useState(null);

    const handleDownloadZip = async (order, item, itemIndex) => {
        const itemKey = `${order._id}-${itemIndex}`;
        setDownloadingZipItemId(itemKey);

        const zip = new JSZip();
        const orderShortId = order._id.slice(-6).toUpperCase();
        const folderName = `order-${orderShortId}-item-${itemIndex + 1}`;
        const folder = zip.folder(folderName);

        const toastId = toast.loading("Generating ZIP archive...", {
            style: {
                border: '3px solid black',
                padding: '16px',
                color: 'black',
                fontWeight: '900',
                textTransform: 'uppercase',
                borderRadius: '0',
                backgroundColor: '#f9f9f6'
            }
        });

        try {
            let fileCount = 0;

            // Helper to download url to arrayBuffer or blob
            const urlToPromise = async (url) => {
                if (url.startsWith('data:')) {
                    const res = await fetch(url);
                    return res.blob();
                }
                const response = await fetch(url, { mode: 'cors' });
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                return response.blob();
            };

            // 1. Add Front Preview
            if (item.imageFront) {
                try {
                    const blob = await urlToPromise(item.imageFront);
                    folder.file("front-preview.png", blob);
                    fileCount++;
                } catch (err) {
                    console.error("Failed to add front preview to zip:", err);
                }
            }

            // 2. Add Back Preview
            if (item.imageBack) {
                try {
                    const blob = await urlToPromise(item.imageBack);
                    folder.file("back-preview.png", blob);
                    fileCount++;
                } catch (err) {
                    console.error("Failed to add back preview to zip:", err);
                }
            }

            // 3. Add Uploaded Assets
            if (item.uploadedImages && item.uploadedImages.length > 0) {
                for (let i = 0; i < item.uploadedImages.length; i++) {
                    try {
                        const blob = await urlToPromise(item.uploadedImages[i]);
                        folder.file(`asset-${i + 1}.png`, blob);
                        fileCount++;
                    } catch (err) {
                        console.error(`Failed to add asset-${i + 1} to zip:`, err);
                    }
                }
            }

            if (fileCount === 0) {
                toast.error("No files found to bundle", { id: toastId });
                return;
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const blobUrl = window.URL.createObjectURL(content);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `order-${orderShortId}-item-${itemIndex + 1}-assets.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            toast.success("ZIP downloaded successfully!", { id: toastId });
        } catch (error) {
            console.error("ZIP creation failed:", error);
            toast.error("Failed to create ZIP package", { id: toastId });
        } finally {
            setDownloadingZipItemId(null);
        }
    };

    const handleDownload = async (imageUrl, defaultFilename) => {
        try {
            if (imageUrl.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = defaultFilename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return;
            }

            const response = await fetch(imageUrl, { mode: 'cors' });
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = defaultFilename;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Failed to download image, opening in new tab instead:", error);
            window.open(imageUrl, '_blank');
        }
    };

    // Format date to show Date + Hour/Minute
    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        }).toUpperCase();

        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: true
        }).toUpperCase();

        return `${formattedDate} • ${formattedTime}`;
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${url}/api/order/list`);
            if (res.data.success) {
                // SORTING: Newest to Oldest based on 'date' or 'createdAt'
                const sortedOrders = res.data.data.sort((a, b) => {
                    const dateA = new Date(a.date || a.createdAt);
                    const dateB = new Date(b.date || b.createdAt);
                    return dateB - dateA;
                });
                setOrders(sortedOrders);
            } else {
                toast.error('Error fetching orders');
            }
        } catch (err) {
            console.log(err);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        setUpdatingStatusId(orderId);
        try {
            const res = await axios.post(`${url}/api/order/status`, {
                orderId,
                status: newStatus
            });

            if (res.data.success) {
                setOrders((prev) =>
                    prev.map((order) =>
                        order._id === orderId
                            ? { ...order, status: newStatus }
                            : order
                    )
                );
                toast.success("Status updated", {
                    style: {
                        border: '3px solid black',
                        padding: '16px',
                        color: 'black',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        borderRadius: '0',
                    },
                });
            } else {
                toast.error('Error updating status');
            }

        } catch (err) {
            console.log(err);
            toast.error("Server error");
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const togglePaymentStatus = async (orderId, newPaymentStatus) => {
        setUpdatingPaymentId(orderId);
        try {
            const res = await axios.post(`${url}/api/order/payment-status`, {
                orderId,
                payment: newPaymentStatus
            });

            if (res.data.success) {
                setOrders((prev) =>
                    prev.map((order) =>
                        order._id === orderId
                            ? { ...order, payment: newPaymentStatus }
                            : order
                    )
                );
                toast.success(`Payment marked as ${newPaymentStatus ? 'Paid' : 'Unpaid'}`, {
                    style: {
                        border: '3px solid black',
                        padding: '16px',
                        color: 'black',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        borderRadius: '0',
                    },
                });
            } else {
                toast.error('Error updating payment status');
            }

        } catch (err) {
            console.log(err);
            toast.error("Server error");
        } finally {
            setUpdatingPaymentId(null);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <section className='min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black px-6 md:ml-64 font-sans'>
                <div className='flex flex-col items-center'>
                    <h2 className='text-4xl font-black uppercase tracking-widest animate-pulse'>Loading Orders...</h2>
                </div>
            </section>
        );
    }

    return (
        <>
            <Toaster position="top-center" />

            <section className='relative max-w-5xl mx-auto  text-black py-16 px-6 sm:px-10 font-sans'>

                {/* HEADING */}
                <div className='max-w-screen mx-auto border-b-[4px] border-black pb-6 mb-10'>
                    <h2 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none'>
                        Customer Orders
                    </h2>
                </div>

                <div className='max-w-screen mx-auto'>
                    {orders.length === 0 ? (
                        <div className='bg-white border-[4px] border-black p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                            <p className='text-2xl font-black uppercase tracking-tight'>No orders found.</p>
                        </div>
                    ) : (
                        <div className='grid gap-8 lg:grid-cols-2'>
                            {orders.map((order) => {
                                const total = order.items?.reduce(
                                    (sum, item) => sum + item.price * (item.quantity || 1), 0
                                );

                                return (
                                    <div
                                        key={order._id}
                                        className='bg-white border-[4px] border-black p-6 sm:p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all'
                                    >
                                        <div>
                                            {/* ORDER HEADER */}
                                            <div className='flex flex-col sm:flex-row justify-between sm:items-end border-b-[3px] border-black pb-4 mb-6'>
                                                <div>
                                                    <h2 className='text-2xl font-black uppercase tracking-tighter'>
                                                        #{order._id.slice(-6).toUpperCase()}
                                                    </h2>
                                                    <p className='text-sm font-bold text-black/60 tracking-widest mt-1'>
                                                        {formatDateTime(order.date || order.createdAt)}
                                                    </p>
                                                </div>
                                                <div className='mt-2 sm:mt-0 text-right'>
                                                    <span className='text-3xl font-black text-[#ff5500]'>
                                                        ${total?.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* CUSTOMER INFO */}
                                            <div className='mb-6 space-y-2'>
                                                <p className='text-sm uppercase'>
                                                    <span className='font-black tracking-widest mr-2'>Customer:</span>
                                                    <span className='font-bold'>{order.userId?.name || 'Unknown'}</span>
                                                </p>
                                                <p className='text-sm uppercase leading-relaxed'>
                                                    <span className='font-black tracking-widest mr-2'>Address:</span>
                                                    <span className='font-bold'>
                                                        {order.address
                                                            ? `${order.address.firstName} ${order.address.lastName}, ${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zipCode}, ${order.address.country} — Ph: ${order.address.phone}`
                                                            : "No address provided"}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* PAYMENT INFO */}
                                            <div className='mb-6 border-t-[3px] border-black pt-4'>
                                                <div className='flex justify-between items-center mb-3'>
                                                    <span className='text-xs font-black uppercase tracking-widest text-black/60'>
                                                        Payment Verification:
                                                    </span>
                                                    <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${order.payment ? 'bg-green-400 text-black' : 'bg-red-400 text-black'}`}>
                                                        {order.payment ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </div>

                                                {order.paymentScreenshot ? (
                                                    <div className='flex items-center gap-4 mt-3 bg-[#e5e5e5]/30 p-3 border border-black/10'>
                                                        <div className='w-16 h-16 bg-[#e5e5e5] border-2 border-black relative group overflow-hidden shrink-0'>
                                                            <img 
                                                                src={order.paymentScreenshot} 
                                                                className='w-full h-full object-cover cursor-zoom-in' 
                                                                alt="Payment receipt" 
                                                                onClick={() => window.open(order.paymentScreenshot, '_blank')} 
                                                            />
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDownload(order.paymentScreenshot, `payment-receipt-${order._id.slice(-6)}.png`); }}
                                                                className='absolute top-0 right-0 bg-white hover:bg-[#ff5500] text-black hover:text-white border-l border-b border-black p-1 transition-all rounded-none z-20 cursor-pointer'
                                                                title="Download Receipt"
                                                            >
                                                                <Download className='w-3 h-3' strokeWidth={3} />
                                                            </button>
                                                        </div>
                                                        <div className='flex flex-col gap-2'>
                                                            <button
                                                                disabled={updatingPaymentId === order._id}
                                                                onClick={() => togglePaymentStatus(order._id, !order.payment)}
                                                                className='flex items-center justify-center gap-2 bg-black text-white hover:bg-[#ff5500] hover:text-black border-2 border-black px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed'
                                                            >
                                                                {updatingPaymentId === order._id && (
                                                                    <Loader2 className="w-3 animate-spin text-current" strokeWidth={3} />
                                                                )}
                                                                <span>{order.payment ? 'Mark Unpaid' : 'Approve Payment'}</span>
                                                            </button>
                                                            <p className='text-[8px] font-black uppercase text-black/40 leading-none'>
                                                                Click receipt to expand
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='text-xs font-black uppercase text-red-500 mt-2'>
                                                        No payment screenshot uploaded
                                                    </div>
                                                )}
                                            </div>

                                            {/* ITEMS LIST */}
                                            <div className='border-t-[3px] border-black pt-4 mb-6'>
                                                <p className='text-xs font-black uppercase tracking-widest text-black/60 mb-4'>
                                                    {order.items?.length || 0} Product{order.items && order.items.length > 1 ? "s" : ""}
                                                </p>

                                                <div className='space-y-3'>
                                                    {order.items?.map((item, index) => (
                                                        <div key={`${item._id}-${index}`} className='flex justify-between items-start gap-4 p-2 hover:bg-black/5'>
                                                            <div className='flex items-start gap-4'>
                                                                {item.image && (
                                                                    <div className='w-16 h-16 bg-[#e5e5e5] border-2 border-black shrink-0'>
                                                                        <img
                                                                            src={item.image}
                                                                            className='w-full h-full object-contain mix-blend-multiply'
                                                                            alt={item.name}
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className='flex flex-col'>
                                                                    <p className='font-black uppercase text-sm leading-tight'>
                                                                        {item.name}
                                                                    </p>
                                                                    <div className='flex gap-3 mt-1'>
                                                                        <p className='text-xs font-bold uppercase'>Size: {item.size || 'M'}</p>
                                                                        <p className='text-xs font-bold uppercase text-[#ff5500]'>Qty: {item.quantity || 1}</p>
                                                                    </div>
                                                                    {item.imageFront && item.imageBack && (
                                                                        <div className='mt-3 space-y-2'>
                                                                            <div className='flex items-center gap-3 justify-between'>
                                                                                <p className='text-[10px] font-black  tracking-wider text-black/50'>Custom Print Preview (Front / Back):</p>

                                                                            </div>
                                                                            <div className='flex gap-3'>
                                                                                <div className='w-20 h-20 bg-[#e5e5e5] border-2 border-black relative group overflow-hidden'>
                                                                                    <img src={item.imageFront} className='w-full h-full object-contain cursor-zoom-in' alt="Custom Front" onClick={() => window.open(item.imageFront, '_blank')} />
                                                                                    <div className='absolute bottom-0 left-0 right-0 bg-black/85 text-white text-[8px] font-black uppercase text-center py-0.5 z-10'>Front</div>
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); handleDownload(item.imageFront, `order-${order._id.slice(-6)}-front.png`); }}
                                                                                        className='absolute top-0 right-0 bg-white hover:bg-[#ff5500] text-black hover:text-white border-l border-b border-black p-1 transition-all rounded-none z-20 cursor-pointer'
                                                                                        title="Download Front Preview"
                                                                                    >
                                                                                        <Download className='w-3 h-3' strokeWidth={3} />
                                                                                    </button>
                                                                                </div>
                                                                                <div className='w-20 h-20 bg-[#e5e5e5] border-2 border-black relative group overflow-hidden'>
                                                                                    <img src={item.imageBack} className='w-full h-full object-contain cursor-zoom-in' alt="Custom Back" onClick={() => window.open(item.imageBack, '_blank')} />
                                                                                    <div className='absolute bottom-0 left-0 right-0 bg-black/85 text-white text-[8px] font-black uppercase text-center py-0.5 z-10'>Back</div>
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); handleDownload(item.imageBack, `order-${order._id.slice(-6)}-back.png`); }}
                                                                                        className='absolute top-0 right-0 bg-white hover:bg-[#ff5500] text-black hover:text-white border-l border-b border-black p-1 transition-all rounded-none z-20 cursor-pointer'
                                                                                        title="Download Back Preview"
                                                                                    >
                                                                                        <Download className='w-3 h-3' strokeWidth={3} />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {item.uploadedImages && item.uploadedImages.length > 0 && (
                                                                        <div className='mt-3 space-y-2'>
                                                                            <div className='flex items-center gap-3 justify-between'>
                                                                                <p className='text-[10px] font-black  tracking-wider text-black/50'>Uploaded Assets ({item.uploadedImages.length}):</p>

                                                                            </div>
                                                                            <div className='flex flex-wrap gap-2'>
                                                                                {item.uploadedImages.map((imgSrc, imgIdx) => (
                                                                                    <div key={imgIdx} className='w-12 h-12 bg-white border-2 border-black relative group overflow-hidden'>
                                                                                        <img
                                                                                            src={imgSrc}
                                                                                            className='w-full h-full object-cover cursor-zoom-in'
                                                                                            alt={`Asset ${imgIdx + 1}`}
                                                                                            onClick={() => window.open(imgSrc, '_blank')}
                                                                                        />
                                                                                        <button
                                                                                            onClick={(e) => { e.stopPropagation(); handleDownload(imgSrc, `order-${order._id.slice(-6)}-asset-${imgIdx + 1}.png`); }}
                                                                                            className='absolute top-0 right-0 bg-white hover:bg-[#ff5500] text-black hover:text-white border-l border-b border-black p-0.5 transition-all rounded-none z-20 cursor-pointer'
                                                                                            title={`Download Asset ${imgIdx + 1}`}
                                                                                        >
                                                                                            <Download className='w-2.5 h-2.5' strokeWidth={3} />
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {(item.imageFront || item.imageBack || (item.uploadedImages && item.uploadedImages.length > 0)) && (
                                                                        <div className='mt-4 pt-3 border-t border-dashed border-black/20'>
                                                                            <button
                                                                                disabled={downloadingZipItemId === `${order._id}-${index}`}
                                                                                onClick={() => handleDownloadZip(order, item, index)}
                                                                                className='flex items-center gap-2 bg-black text-[#ff5500] hover:bg-[#ff5500] hover:text-black border-2 border-black px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                                                                            >
                                                                                {downloadingZipItemId === `${order._id}-${index}` ? (
                                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={3} />
                                                                                ) : (
                                                                                    <Download className="w-3.5 h-3.5" strokeWidth={3} />
                                                                                )}
                                                                                <span>{downloadingZipItemId === `${order._id}-${index}` ? "Generating ZIP..." : "Download ZIP Package"}</span>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className='font-black text-lg'>
                                                                ${(item.price * (item.quantity || 1)).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* STATUS UPDATER */}
                                        <div className='mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#e5e5e5] p-4 border-[3px] border-black'>
                                            <span className='font-black uppercase tracking-widest text-sm shrink-0 flex items-center gap-2'>
                                                {updatingStatusId === order._id && (
                                                    <Loader2 className="w-4 h-4 animate-spin text-black" strokeWidth={3} />
                                                )}
                                                Order Status:
                                            </span>
                                            <select
                                                disabled={updatingStatusId === order._id}
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className='w-full sm:w-auto border-[3px] border-black rounded-none px-4 py-2 bg-white text-black font-black uppercase tracking-widest cursor-pointer focus:outline-none focus:border-[#ff5500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                <option value='pending'>Pending</option>
                                                <option value='on the way'>On The Way</option>
                                                <option value='delivered'>Delivered</option>
                                            </select>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default Orders;