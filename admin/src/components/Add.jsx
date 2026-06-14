import React from 'react'
import axios from 'axios'
import { useState } from 'react'


const Add = () => {


    const url = 'https://shop-2-ms77.onrender.com'
    const [image, setImage] = useState(null)
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Men',
        color: 'Black',
    })

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    const onImageChange = (e) => {
        if (e.target.files[0] && e.target.files) {
            setImage(e.target.files[0])
        }
    }



    const onSubmitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('price', Number(data.price))
        formData.append('category', data.category)
        formData.append('color', data.color)
        if (image) formData.append('image', image)

        try {
            const token = localStorage.getItem('adminToken')
            const res = await axios.post(`${url}/api/product/add`, formData, {
                headers: { token }
            })
            if (res.data.success) {
                setData({
                    name: '',
                    description: '',
                    price: '',
                    category: 'Men',
                    color: 'Black',
                })
                setImage(null)
                document.getElementById('imageInput').value = ''
                alert("Product Added Successfully")
            } else {
                alert(res.data.message)
            }
        } catch (err) {
            console.log(err)
            // Extract and show the actual error message from the backend
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong"
            alert(`Error: ${errorMessage}`)
        }


    }


    return (
        <section className='relative w-full min-h-screen bg-linear-to-r from-indigo-900 
    via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10'>

            <form onSubmit={onSubmitHandler}>
                <div className='relative z-10 max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-10 
  rounded-3xl shadow-xl'>
                    <h2 className='text-3xl font-bold mb-6 text-center'>Add New Product
                    </h2>

                    <div className='space-y-4'>
                        <input type='text'
                            name='name'
                            placeholder='Product Name'
                            value={data.name}
                            onChange={onChangeHandler}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/15 text-white
         placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        />

                        <input type='text'
                            name='description'
                            placeholder='Product Description'
                            value={data.description}
                            onChange={onChangeHandler}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/15 text-white
         placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none "
                        />

                        <input type='number'
                            name='price'
                            placeholder='Price'
                            value={data.price}
                            onChange={onChangeHandler}
                            required
                            min="0"
                            className="w-full px-4 py-3 rounded-xl bg-white/15 text-white
         placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none "
                        />

                        <select name='category'
                            value={data.category}
                            onChange={onChangeHandler}
                            className="w-full px-4 py-3 rounded-xl bg-white/15 text-white
         placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none ">


                            <option>Men</option>
                            <option>Women</option>
                            <option>Kids</option>
                            <option>Electronics</option>
                            <option>Cosmetics</option>
                        </select>

                        <select name='color'
                            value={data.color}
                            onChange={onChangeHandler}
                            className="w-full px-4 py-3 rounded-xl bg-white/15 text-white
         placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none ">

                            <option>Black</option>
                            <option>White</option>
                            <option>Red</option>
                            <option>Blue</option>
                        </select>

                        <input type='file'
                            accept='image/*'
                            id='imageInput'
                            onChange={onImageChange}
                            required
                            className='w-full text-white'
                        /> Add image
                        {image && (
                            <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className='w-full h-64 object-cover rounded-2xl mt-2'
                            />                        )}

                        <button type='submit'
                            className='w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500
px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all 
text-white shadow-lg mt-4 '>
                            Add Product

                        </button>



                    </div>
                </div >

            </form>

        </section>
    )
}

export default Add