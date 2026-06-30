import { useState, useEffect } from 'react';
import { Trash2, Edit2, X, Upload } from 'lucide-react';
import axios from 'axios';

function List() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        
        try {
            const formData = new FormData();
            formData.append("name", editingProduct.name);
            formData.append("description", editingProduct.description);
            formData.append("price", editingProduct.price);
            formData.append("category", editingProduct.category);
            formData.append("color", editingProduct.color);
            formData.append("sizes", JSON.stringify(editingProduct.sizes));
            
            if (editingProduct.newImage) {
                formData.append("image", editingProduct.newImage);
            }

            const res = await axios.put(`${url}/api/product/update/${editingProduct._id}`, formData);
            if (res.data.success) {
                setEditingProduct(null);
                setImagePreview(null);
                await fetchProducts();
            } else {
                alert("Error updating product");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating product");
        } finally {
            setUpdating(false);
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

                                {/* ACTION BUTTONS */}
                                <div className='flex gap-2 w-full mt-2'>
                                    <button
                                        onClick={() => {
                                            setEditingProduct({ ...product, newImage: null });
                                            setImagePreview(product.image);
                                        }}
                                        className='flex-1 flex items-center justify-center gap-2 bg-black text-[#ff5500] border-[3px] border-black py-3 font-black uppercase tracking-widest hover:bg-[#ff5500] hover:text-black transition-colors'
                                    >
                                        <Edit2 className='w-4 h-4' strokeWidth={3} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className='flex-1 flex items-center justify-center gap-2 bg-black text-[#ff5500] border-[3px] border-black py-3 font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors'
                                    >
                                        <Trash2 className='w-4 h-4' strokeWidth={3} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* EDIT MODAL */}
                {editingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <div className="bg-[#f9f9f6] border-[4px] border-black w-full max-w-3xl my-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-6 border-b-[4px] border-black shrink-0">
                                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Edit Product</h3>
                                <button onClick={() => setEditingProduct(null)} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
                                    <X className="w-6 h-6" strokeWidth={3} />
                                </button>
                            </div>
                            
                            <div className="overflow-y-auto p-6">
                                <form id="editProductForm" onSubmit={handleUpdate} className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase tracking-widest">Product Name</label>
                                        <input type="text" required value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#ff5500] bg-white" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase tracking-widest">Description</label>
                                        <textarea required value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} className="p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#ff5500] bg-white min-h-[100px]" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase tracking-widest">Price</label>
                                            <input type="number" required value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} className="p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#ff5500] bg-white" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase tracking-widest">Category</label>
                                            <input type="text" required value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#ff5500] bg-white" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase tracking-widest">Color</label>
                                            <input type="text" required value={editingProduct.color} onChange={(e) => setEditingProduct({...editingProduct, color: e.target.value})} className="p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#ff5500] bg-white" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase tracking-widest">Update Image</label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 border-2 border-black bg-white p-2 shrink-0">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <label className="cursor-pointer flex-1 flex flex-col items-center justify-center border-2 border-dashed border-black p-6 hover:bg-black/5 transition-colors">
                                                <Upload className="w-8 h-8 mb-2 text-black/50" />
                                                <span className="font-bold uppercase text-sm text-center">Click to upload new image</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if(file) {
                                                        setEditingProduct({...editingProduct, newImage: file});
                                                        setImagePreview(URL.createObjectURL(file));
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t-[4px] border-black shrink-0">
                                <button type="submit" form="editProductForm" disabled={updating} className="w-full bg-[#ff5500] text-black border-[3px] border-black py-4 font-black uppercase tracking-widest text-lg hover:bg-black hover:text-[#ff5500] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                                    {updating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default List;