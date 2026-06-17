import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const MockupsList = () => {
    const url = 'https://shop-2-ms77.onrender.com';
    const [list, setList] = useState([]);

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

    const fetchList = async () => {
        try {
            const res = await axios.get(`${url}/api/mockup/list`);
            if (res.data.success) {
                setList(res.data.data);
            } else {
                toast.error("Error fetching mockups", toastStyle);
            }
        } catch (error) {
            toast.error(error.message, toastStyle);
        }
    };

    const removeMockup = async (mockupId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.delete(`${url}/api/mockup/remove/${mockupId}`, {
                headers: { token }
            });
            if (res.data.success) {
                toast.success(res.data.message, toastStyle);
                await fetchList();
            } else {
                toast.error("Error removing mockup", toastStyle);
            }
        } catch (error) {
            toast.error(error.message, toastStyle);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <section className='relative  max-w-screen mx-auto bg-[#f9f9f6] text-black py-16 px-6 sm:px-10 font-sans '>
            <Toaster position="top-center" />
            <div className='max-w-4xl mx-auto'>
                <div className='bg-white border-[4px] border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                    <div className='border-b-[4px] border-black pb-6 mb-8 flex justify-between items-end'>
                        <h2 className='text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none'>
                            Mockups List
                        </h2>
                    </div>

                    <div className='flex flex-col gap-6'>
                        <div className='hidden sm:grid grid-cols-[1.5fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 border-[3px] border-black bg-[#e5e5e5] font-black uppercase tracking-widest text-sm'>
                            <b>Image</b>
                            <b>Name</b>
                            <b>Category</b>
                            <b>Price</b>
                            <b className='text-center'>Action</b>
                        </div>

                        {list.length === 0 ? (
                            <div className="text-center font-bold text-xl py-10 uppercase tracking-widest border-[3px] border-black border-dashed text-black/50">
                                No Mockups Found
                            </div>
                        ) : (
                            list.map((item, index) => (
                                <div key={index} className='grid grid-cols-[1fr_3fr_1fr] sm:grid-cols-[1.5fr_3fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-16 h-16 sm:w-20 sm:h-20 border-2 border-black bg-[#f9f9f6] flex items-center justify-center p-1'>
                                            <img src={item.imageFront || item.image} alt={item.name} title="Front" className='max-w-full max-h-full object-contain mix-blend-multiply' />
                                        </div>
                                        {item.imageBack && (
                                            <div className='hidden md:flex w-16 h-16 sm:w-20 sm:h-20 border-2 border-black bg-[#f9f9f6] items-center justify-center p-1'>
                                                <img src={item.imageBack} alt={`${item.name} Back`} title="Back" className='max-w-full max-h-full object-contain mix-blend-multiply' />
                                            </div>
                                        )}
                                    </div>
                                    <p className='font-bold text-lg leading-tight uppercase tracking-tight'>{item.name}</p>
                                    <p className='font-bold text-sm uppercase tracking-widest hidden sm:block'>{item.category}</p>
                                    <p className='font-black text-xl hidden sm:block'>${item.price}</p>
                                    <button onClick={() => removeMockup(item._id)} className='cursor-pointer text-xl font-black border-2 border-black w-10 h-10 flex items-center justify-center hover:bg-[#ff5500] hover:text-white transition-colors bg-[#e5e5e5] justify-self-center sm:justify-self-center'>
                                        X
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MockupsList;