import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Edit2, X, Upload } from 'lucide-react';

const MockupsList = () => {
    const url = 'https://shop-2-ms77.onrender.com';
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMockup, setEditingMockup] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [imageFrontPreview, setImageFrontPreview] = useState(null);
    const [imageBackPreview, setImageBackPreview] = useState(null);

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
        } finally {
            setLoading(false);
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const formData = new FormData();
            formData.append("name", editingMockup.name);
            formData.append("description", editingMockup.description || "");
            formData.append("price", editingMockup.price);
            formData.append("sizes", JSON.stringify(editingMockup.sizes || ["S", "M", "L", "XL"]));
            
            if (editingMockup.newImageFront) formData.append("imageFront", editingMockup.newImageFront);
            if (editingMockup.newImageBack) formData.append("imageBack", editingMockup.newImageBack);

            const token = localStorage.getItem('adminToken');
            const res = await axios.put(`${url}/api/mockup/update/${editingMockup._id}`, formData, {
                headers: { token }
            });
            
            if (res.data.success) {
                toast.success("Mockup updated successfully", toastStyle);
                setEditingMockup(null);
                setImageFrontPreview(null);
                setImageBackPreview(null);
                await fetchList();
            } else {
                toast.error("Error updating mockup", toastStyle);
            }
        } catch (error) {
            toast.error(error.message, toastStyle);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    if (loading) {
        return (
            <section className='min-h-screen flex items-center justify-center bg-[#f9f9f6] text-black px-6 md:ml-64 font-sans'>
                <div className='flex flex-col items-center'>
                    <h2 className='text-4xl font-black uppercase tracking-widest animate-pulse'>Loading Mockups...</h2>
                </div>
            </section>
        );
    }

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
                            <b>Price</b>
                            <b className='text-center'>Action</b>
                        </div>

                        {list.length === 0 ? (
                            <div className="text-center font-bold text-xl py-10 uppercase tracking-widest border-[3px] border-black border-dashed text-black/50">
                                No Mockups Found
                            </div>
                        ) : (
                            list.map((item, index) => (
                                <div key={index} className='grid grid-cols-[1fr_3fr_1fr] sm:grid-cols-[1.5fr_3fr_1fr_1fr] items-center gap-4 py-3 px-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'>
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
                                    <p className='font-black text-xl hidden sm:block'>${item.price}</p>
                                    <div className='flex gap-2 justify-self-center'>
                                        <button onClick={() => {
                                            setEditingMockup({ ...item, newImageFront: null, newImageBack: null });
                                            setImageFrontPreview(item.imageFront || item.image);
                                            setImageBackPreview(item.imageBack);
                                        }} className='cursor-pointer text-sm border-2 border-black w-10 h-10 flex items-center justify-center hover:bg-[#ff5500] hover:text-white transition-colors bg-[#e5e5e5]'>
                                            <Edit2 className="w-4 h-4" strokeWidth={3} />
                                        </button>
                                        <button onClick={() => removeMockup(item._id)} className='cursor-pointer text-xl font-black border-2 border-black w-10 h-10 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors bg-[#e5e5e5]'>
                                            X
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* EDIT MODAL */}
                {editingMockup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <div className="bg-[#f9f9f6] border-[4px] border-black w-full max-w-3xl my-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-6 border-b-[4px] border-black shrink-0">
                                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Edit Mockup</h3>
                                <button onClick={() => setEditingMockup(null)} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
                                    <X className="w-6 h-6" strokeWidth={3} />
                                </button>
                            </div>
                            
                            <div className="overflow-y-auto p-6">
                                <form id="editMockupForm" onSubmit={handleUpdate} className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase tracking-widest">Mockup Name</label>
                                        <input type="text" required value={editingMockup.name} onChange={(e) => setEditingMockup({...editingMockup, name: e.target.value})} className="p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#ff5500] bg-white" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase tracking-widest">Description</label>
                                        <textarea required value={editingMockup.description} onChange={(e) => setEditingMockup({...editingMockup, description: e.target.value})} className="p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#ff5500] bg-white min-h-[100px]" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase tracking-widest">Price</label>
                                        <input type="number" required value={editingMockup.price} onChange={(e) => setEditingMockup({...editingMockup, price: e.target.value})} className="p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#ff5500] bg-white" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase tracking-widest">Front Image</label>
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-32 h-32 border-2 border-black bg-white p-2 shrink-0">
                                                    <img src={imageFrontPreview} alt="Front Preview" className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <label className="w-full cursor-pointer flex-1 flex flex-col items-center justify-center border-2 border-dashed border-black p-4 hover:bg-black/5 transition-colors">
                                                    <Upload className="w-6 h-6 mb-2 text-black/50" />
                                                    <span className="font-bold uppercase text-xs text-center">Upload new</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if(file) {
                                                            setEditingMockup({...editingMockup, newImageFront: file});
                                                            setImageFrontPreview(URL.createObjectURL(file));
                                                        }
                                                    }} />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase tracking-widest">Back Image (Optional)</label>
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-32 h-32 border-2 border-black bg-white p-2 shrink-0 flex items-center justify-center">
                                                    {imageBackPreview ? (
                                                        <img src={imageBackPreview} alt="Back Preview" className="w-full h-full object-contain mix-blend-multiply" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-black/40">No Back Image</span>
                                                    )}
                                                </div>
                                                <label className="w-full cursor-pointer flex-1 flex flex-col items-center justify-center border-2 border-dashed border-black p-4 hover:bg-black/5 transition-colors">
                                                    <Upload className="w-6 h-6 mb-2 text-black/50" />
                                                    <span className="font-bold uppercase text-xs text-center">Upload new</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if(file) {
                                                            setEditingMockup({...editingMockup, newImageBack: file});
                                                            setImageBackPreview(URL.createObjectURL(file));
                                                        }
                                                    }} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t-[4px] border-black shrink-0">
                                <button type="submit" form="editMockupForm" disabled={updating} className="w-full bg-[#ff5500] text-black border-[3px] border-black py-4 font-black uppercase tracking-widest text-lg hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                                    {updating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MockupsList;