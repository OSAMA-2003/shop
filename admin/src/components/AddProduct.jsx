import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddProduct = () => {
    const url = 'https://shop-2-ms77.onrender.com';
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false); // Track loading state
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Men',
        color: 'Black',
    });
    const [selectedSizes, setSelectedSizes] = useState(["S", "M", "L", "XL"]);

    // Custom styles for brutalist toast notifications
    const toastStyle = {
        style: {
            border: '3px solid black',
            padding: '16px',
            color: 'black',
            fontWeight: '900',
            textTransform: 'uppercase',
            borderRadius: '0',
            backgroundColor: '#f9f9f6'
        },
    };

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        // Prevent submission if already loading
        if (loading) return; 
        
        setLoading(true); // Start loading

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', Number(data.price));
        formData.append('category', data.category);
        formData.append('color', data.color);
        formData.append('sizes', JSON.stringify(selectedSizes));
        if (image) formData.append('image', image);

        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post(`${url}/api/product/add`, formData, {
                headers: { token }
            });
            if (res.data.success) {
                setData({
                    name: '',
                    description: '',
                    price: '',
                    category: 'Men',
                    color: 'Black',
                });
                setSelectedSizes(["S", "M", "L", "XL"]);
                setImage(null);
                document.getElementById('imageInput').value = '';
                toast.success("Product Added Successfully", toastStyle);
            } else {
                toast.error(res.data.message, toastStyle);
            }
        } catch (err) {
            console.log(err);
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(`Error: ${errorMessage}`, toastStyle);
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <section className='relative max-w-screen mx-auto p-4 w-fullbg-[#f9f9f6] text-black py-16 px-6 sm:px-10 font-sans '>
            
            <Toaster position="top-center" />

            <form onSubmit={onSubmitHandler} className='max-w-3xl mx-auto'>
                
                {/* FORM CONTAINER */}
                <div className='bg-white border-[4px] border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                    
                    {/* HEADING */}
                    <div className='border-b-[4px] border-black pb-6 mb-8'>
                        <h2 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none'>
                            Add Product
                        </h2>
                    </div>

                    <div className='flex flex-col gap-6'>
                        
                        {/* NAME & PRICE ROW */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Product Name *</label>
                                <input 
                                    type='text'
                                    name='name'
                                    placeholder='HEAVYWEIGHT TEE'
                                    value={data.name}
                                    onChange={onChangeHandler}
                                    required
                                    className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors"
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Price ($) *</label>
                                <input 
                                    type='number'
                                    name='price'
                                    placeholder='0.00'
                                    value={data.price}
                                    onChange={onChangeHandler}
                                    required
                                    min="0"
                                    className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors"
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className='flex flex-col'>
                            <label className='text-sm font-black uppercase tracking-widest mb-2'>Description *</label>
                            <textarea 
                                name='description'
                                placeholder='Enter product details, materials, and fit...'
                                value={data.description}
                                onChange={onChangeHandler}
                                required
                                rows="3"
                                className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors resize-none"
                            />
                        </div>

                        {/* CATEGORY & COLOR ROW */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Category *</label>
                                <select 
                                    name='category'
                                    value={data.category}
                                    onChange={onChangeHandler}
                                    className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-white text-black transition-colors cursor-pointer appearance-none"
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Kids">Kids</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Cosmetics">Cosmetics</option>
                                </select>
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Color *</label>
                                <select 
                                    name='color'
                                    value={data.color}
                                    onChange={onChangeHandler}
                                    className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-white text-black transition-colors cursor-pointer appearance-none"
                                >
                                    <option value="Black">Black</option>
                                    <option value="White">White</option>
                                    <option value="Red">Red</option>
                                    <option value="Blue">Blue</option>
                                </select>
                            </div>
                        </div>

                        {/* SIZES SELECTION */}
                        <div className='flex flex-col'>
                            <label className='text-sm font-black uppercase tracking-widest mb-2'>Available Sizes *</label>
                            <div className='flex gap-4 flex-wrap'>
                                {["S", "M", "L", "XL", "XXL"].map((size) => (
                                    <label key={size} className="flex items-center gap-2 cursor-pointer font-bold text-sm uppercase">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedSizes.includes(size)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedSizes(prev => [...prev, size]);
                                                } else {
                                                    setSelectedSizes(prev => prev.filter(s => s !== size));
                                                }
                                            }}
                                            className="w-5 h-5 border-2 border-black accent-black rounded-none cursor-pointer"
                                        />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className='flex flex-col'>
                            <label className='text-sm font-black uppercase tracking-widest mb-2'>Product Image *</label>
                            <input 
                                type='file'
                                accept='image/*'
                                id='imageInput'
                                onChange={onImageChange}
                                required
                                className='w-full border-[3px] border-black p-2 font-bold cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-black file:uppercase file:bg-black file:text-white hover:file:bg-[#ff5500] hover:file:text-black transition-all'
                            />
                            
                            {/* IMAGE PREVIEW */}
                            {image && (
                                <div className="mt-4 border-[3px] border-black p-2 bg-[#e5e5e5] w-fit">
                                    <img 
                                        src={URL.createObjectURL(image)} 
                                        alt="Preview" 
                                        className='w-48 h-48 object-cover mix-blend-multiply' 
                                    />
                                </div>
                            )}
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button 
                            type='submit'
                            disabled={loading}
                            className={`w-full mt-6 border-[3px] border-black py-4 font-black text-xl uppercase tracking-widest transition-all ${
                                loading 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none translate-y-[2px] translate-x-[2px]' 
                                : 'bg-[#ff5500] text-black hover:bg-black hover:text-[#ff5500] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
                            }`}
                        >
                            {loading ? "Publishing..." : "Publish Product"}
                        </button>

                    </div>
                </div>
            </form>
        </section>
    );
}

export default AddProduct;