import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContenxt'

const Product = () => {
  const { addToCart, all_products } = useContext(ShopContext)
  const { productId } = useParams()
  const product = all_products.find((p) => p._id === productId)

  const [selectedColor, setSelectedColor] = useState("Red")
  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white 
      bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900">
        <p className="text-lg font-bold">Product not found</p>
      </section>
    )
  }

  const handleAddToCart = () => {
    addToCart(product._id, quantity)
    alert(`Added ${quantity} pieces of ${product.name} to the cart!`)
  }

  return (
    <section className="relative w-full min-h-screen 
    bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 
    text-white py-16 px-4 sm:px-6">

      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md 
      rounded-2xl p-4 flex flex-col md:flex-row gap-6 shadow-xl">

        {/* IMAGE */}
        <div className="md:w-1/2 flex items-center justify-center 
        bg-white/5 rounded-2xl p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-48 h-48 object-contain rounded-xl"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-4">

          <h2 className="text-xl md:text-2xl font-extrabold">
            {product.name}
          </h2>

          <p className="text-gray-300 text-sm md:text-base">
            {product.description}
          </p>

          <p className="text-cyan-400 text-xl md:text-2xl font-bold">
            ${product.price}
          </p>

          <p className="text-gray-200 text-sm">
            Category: {product.category}
          </p>

          {/* COLOR */}
          <div>
            <h4 className="font-semibold mb-1 text-sm">Color:</h4>
            <div className="flex gap-2">
              {["Red", "Blue", "Green", "Black", "White"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border transition-all
                  ${selectedColor === color ? "scale-110 border-cyan-500" : "border-white/50"}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div>
            <h4 className="font-semibold mb-1 text-sm">Size:</h4>
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded-lg border text-sm transition-all
                  ${selectedSize === size ? "bg-cyan-400 text-black scale-105" : "border-white/50"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-3 text-sm">
            <h4 className="font-semibold">Qty</h4>

            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-white/20 px-2 py-0.5 rounded-lg hover:bg-white/30 transition-all"
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-white/20 px-2 py-0.5 rounded-lg hover:bg-white/30 transition-all"
            >
              +
            </button>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleAddToCart}
            className="w-full md:w-auto bg-linear-to-r
            from-indigo-500 via-purple-500 to-pink-500
            px-5 py-2 rounded-xl font-semibold text-sm
            hover:opacity-90 transition-all text-white shadow-md"
          >
            Add to cart
          </button>

        </div>
      </div>
    </section>
  )
}

export default Product