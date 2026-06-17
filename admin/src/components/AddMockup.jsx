import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddMockup = () => {
    const url = 'https://shop-2-ms77.onrender.com';
    const [imageFront, setImageFront] = useState(null);
    const [imageBack, setImageBack] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'T-Shirt',
        color: 'Black',
    });

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

    const onImageFrontChange = (e) => {
        if (e.target.files[0]) {
            setImageFront(e.target.files[0]);
        }
    };

    const onImageBackChange = (e) => {
        if (e.target.files[0]) {
            setImageBack(e.target.files[0]);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (loading) return; 
        
        setLoading(true);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', Number(data.price));
        formData.append('category', data.category);
        formData.append('color', data.color);
        if (imageFront) formData.append('imageFront', imageFront);
        if (imageBack) formData.append('imageBack', imageBack);

        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post(`${url}/api/mockup/add`, formData, {
                headers: { token }
            });
            if (res.data.success) {
                setData({
                    name: '',
                    description: '',
                    price: '',
                    category: 'T-Shirt',
                    color: 'Black',
                });
                setImageFront(null);
                setImageBack(null);
                document.getElementById('imageFrontInput').value = '';
                document.getElementById('imageBackInput').value = '';
                toast.success("Mockup Added Successfully", toastStyle);
            } else {
                toast.error(res.data.message, toastStyle);
            }
        } catch (err) {
            console.log(err);
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(`Error: ${errorMessage}`, toastStyle);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='relative max-w-screen mx-auto p-4 w-fullbg-[#f9f9f6] text-black py-16 px-6 sm:px-10 font-sans '>
            
            <Toaster position="top-center" />

            <form onSubmit={onSubmitHandler} className='max-w-3xl mx-auto'>
                
                <div className='bg-white border-[4px] border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                    
                    <div className='border-b-[4px] border-black pb-6 mb-8'>
                        <h2 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none'>
                            Add Mockup
                        </h2>
                    </div>

                    <div className='flex flex-col gap-6'>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Mockup Name *</label>
                                <input 
                                    type='text'
                                    name='name'
                                    placeholder='e.g., T-Shirt Front'
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

                        <div className='flex flex-col'>
                            <label className='text-sm font-black uppercase tracking-widest mb-2'>Description *</label>
                            <textarea 
                                name='description'
                                placeholder='Enter mockup details...'
                                value={data.description}
                                onChange={onChangeHandler}
                                required
                                rows="3"
                                className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors resize-none"
                            />
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Category *</label>
                                <select 
                                    name='category'
                                    value={data.category}
                                    onChange={onChangeHandler}
                                    className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-white text-black transition-colors cursor-pointer appearance-none"
                                >
                                    <option value="T-Shirt">T-Shirt</option>
                                    <option value="Hoodie">Hoodie</option>
                                    <option value="Mug">Mug</option>
                                    <option value="Cap">Cap</option>
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
                                    <option value="Gray">Gray</option>
                                </select>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Front Mockup Image *</label>
                                <input 
                                    type='file'
                                    accept='image/*'
                                    id='imageFrontInput'
                                    onChange={onImageFrontChange}
                                    required
                                    className='w-full border-[3px] border-black p-2 font-bold cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-black file:uppercase file:bg-black file:text-white hover:file:bg-[#ff5500] hover:file:text-black transition-all'
                                />
                                
                                {imageFront && (
                                    <div className="mt-4 border-[3px] border-black p-2 bg-[#e5e5e5] w-fit">
                                        <img 
                                            src={URL.createObjectURL(imageFront)} 
                                            alt="Front Preview" 
                                            className='w-48 h-48 object-cover mix-blend-multiply' 
                                        />
                                    </div>
                                )}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Back Mockup Image *</label>
                                <input 
                                    type='file'
                                    accept='image/*'
                                    id='imageBackInput'
                                    onChange={onImageBackChange}
                                    required
                                    className='w-full border-[3px] border-black p-2 font-bold cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-black file:uppercase file:bg-black file:text-white hover:file:bg-[#ff5500] hover:file:text-black transition-all'
                                />
                                
                                {imageBack && (
                                    <div className="mt-4 border-[3px] border-black p-2 bg-[#e5e5e5] w-fit">
                                        <img 
                                            src={URL.createObjectURL(imageBack)} 
                                            alt="Back Preview" 
                                            className='w-48 h-48 object-cover mix-blend-multiply' 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            type='submit'
                            disabled={loading}
                            className={`w-full mt-6 border-[3px] border-black py-4 font-black text-xl uppercase tracking-widest transition-all ${
                                loading 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none translate-y-[2px] translate-x-[2px]' 
                                : 'bg-[#ff5500] text-black hover:bg-black hover:text-[#ff5500] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
                            }`}
                        >
                            {loading ? "Publishing..." : "Publish Mockup"}
                        </button>

                    </div>
                </div>
            </form>
        </section>
    );
}

export default AddMockup;