import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const AddMockup = () => {
    const url = 'https://shop-3-ocd8.onrender.com';
    const [imageFront, setImageFront] = useState(null);
    const [imageBack, setImageBack] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: '',
        price: '',
    });
    const [selectedSizes, setSelectedSizes] = useState(["S", "M", "L", "XL"]);

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
        // Send fallback values for standard name/description so legacy code works
        formData.append('name', data.name_en);
        formData.append('name_en', data.name_en);
        formData.append('name_ar', data.name_ar);
        formData.append('description', data.description_en);
        formData.append('description_en', data.description_en);
        formData.append('description_ar', data.description_ar);
        formData.append('price', Number(data.price));
        formData.append('sizes', JSON.stringify(selectedSizes));
        if (imageFront) formData.append('imageFront', imageFront);
        if (imageBack) formData.append('imageBack', imageBack);

        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post(`${url}/api/mockup/add`, formData, {
                headers: { token }
            });
            if (res.data.success) {
                setData({
                    name_en: '',
                    name_ar: '',
                    description_en: '',
                    description_ar: '',
                    price: '',
                });
                setSelectedSizes(["S", "M", "L", "XL"]);
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
        <section className='relative max-w-screen mx-auto p-4 w-full bg-[#f9f9f6] text-black py-16 px-6 sm:px-10 font-sans '>
            <form onSubmit={onSubmitHandler} className='max-w-3xl mx-auto'>
                <div className='bg-white border-[4px] border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                    <div className='border-b-[4px] border-black pb-6 mb-8'>
                        <h2 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none'>
                            Add New Mockup Canvas
                        </h2>
                    </div>

                    <div className='flex flex-col gap-6'>
                        {/* NAMES ROW */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Mockup Name (English) *</label>
                                <input
                                    type='text'
                                    name='name_en'
                                    placeholder='e.g. Oversized Hoodie Mockup'
                                    value={data.name_en}
                                    onChange={onChangeHandler}
                                    required
                                    className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors"
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Mockup Name (Arabic) *</label>
                                <input
                                    type='text'
                                    name='name_ar'
                                    placeholder='مثال: هودي اوفر سايز موك اب'
                                    value={data.name_ar}
                                    onChange={onChangeHandler}
                                    required
                                    className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors text-right"
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION ROW */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Mockup Description (English) *</label>
                                <textarea
                                    name='description_en'
                                    placeholder='Detailed description of the mockup canvas in English'
                                    value={data.description_en}
                                    onChange={onChangeHandler}
                                    required
                                    rows="3"
                                    className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors resize-none"
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Mockup Description (Arabic) *</label>
                                <textarea
                                    name='description_ar'
                                    placeholder='وصف تفصيلي للموك اب باللغة العربية'
                                    value={data.description_ar}
                                    onChange={onChangeHandler}
                                    required
                                    rows="3"
                                    className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors resize-none text-right"
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        {/* PRICE */}
                        <div className='flex flex-col'>
                            <label className='text-sm font-black uppercase tracking-widest mb-2'>Price (EGP) *</label>
                            <input
                                type='number'
                                name='price'
                                placeholder='e.g. 500'
                                value={data.price}
                                onChange={onChangeHandler}
                                required
                                min="0"
                                className="w-full border-[3px] border-black p-3 outline-none focus:ring-0 focus:border-[#ff5500] font-bold rounded-none bg-transparent text-black placeholder-black/30 transition-colors"
                            />
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

                        {/* IMAGES UPLOADS */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='flex flex-col'>
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Upload Front Image *</label>
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
                                <label className='text-sm font-black uppercase tracking-widest mb-2'>Upload Back Image *</label>
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

                        {/* SUBMIT BUTTON */}
                        <button
                            type='submit'
                            disabled={loading}
                            className={`w-full mt-6 border-[3px] border-black py-4 font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer ${loading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none translate-y-[2px] translate-x-[2px]'
                                    : 'bg-[#ff5500] text-black hover:bg-black hover:text-[#ff5500] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                                    Saving...
                                </>
                            ) : (
                                "Add Mockup"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default AddMockup;