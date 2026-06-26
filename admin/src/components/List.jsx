import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

function List() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = 'https://shop-2-ms77.onrender.com';

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${url}/api/product/list`);
            if (res.data.success) {
                setProducts(res.data.data);
            } else {
                console.log("Error fetching products");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        // Optional: Add a confirmation dialog so you don't accidentally delete products
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await axios.delete(`${url}/api/product/remove/${id}`);
            if (res.data.success) {
                await fetchProducts(); // Refresh the list
            } else {
                alert("Error deleting product");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <section className='min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black px-6 md:ml-64 font-sans'>
                <div className='flex flex-col items-center'>
                    <h2 className='text-4xl font-black uppercase tracking-widest animate-pulse'>Loading Inventory...</h2>
                </div>
            </section>
        );
    }

    return (
        <section className='relative  max-w-screen mx-auto bg-[#f9f9f6] text-black py-16 px-6 sm:px-10 font-sans '>
            <div className='max-w-7xl mx-auto md:pl-50 flex-wrap'>
                
                {/* HEADING */}
                <div className='border-b-[4px] border-black pb-6 mb-10'>
                    <h2 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none'>
                        Inventory List
                    </h2>
                </div>

                {products.length === 0 ? (
                    <div className='bg-white border-[4px] border-black p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                        <p className='text-2xl font-black uppercase tracking-tight'>No products found.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {products.map((product) => (
                            <div 
                                key={product._id} 
                                className='bg-white border-[4px] border-black p-5 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all'
                            >
                                <div>
                                    {/* IMAGE CONTAINER */}
                                    <div className='bg-[#e5e5e5] border-2 border-black p-2 mb-4 h-56 flex items-center justify-center relative group'>
                                        {/* Category Badge */}
                                        <div className='absolute top-2 left-2 bg-black text-[#ff5500] text-[10px] font-black uppercase px-2 py-1 z-10 border border-black'>
                                            {product.category}
                                        </div>
                                        
                                        <img
                                            // Fixed image URL mapping to match your backend diskStorage setup
                                            src={product.image}
                                            alt={product.name}
                                            className='w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300'
                                        />
                                    </div>

                                    {/* DETAILS */}
                                    <h3 className='text-xl font-black uppercase tracking-tight leading-tight mb-1 truncate'>
                                        {product.name}
                                    </h3>
                                    <p className='text-xs font-mono text-black/70 mb-4 line-clamp-2 leading-relaxed'>
                                        {product.description}
                                    </p>
                                    <p className='text-3xl font-black tracking-tighter mb-6'>
                                        ${Number(product.price).toFixed(2)}
                                    </p>
                                </div>

                                {/* DELETE BUTTON */}
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className='w-full flex items-center justify-center gap-2 bg-black text-[#ff5500] border-[3px] border-black py-3 font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors'
                                >
                                    <Trash2 className='w-5 h-5' strokeWidth={2.5} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default List;