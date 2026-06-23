import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import MockupGrid from '../components/MockupGrid'
import { ShopContext } from '../context/ShopContenxt'
import CardSkeleton from '../components/CardSkeleton'

export default function Mockups() {
  const { all_mockups, loading } = useContext(ShopContext);

  const formattedMockups = (all_mockups || []).map(m => ({
    id: m._id,
    name: m.name,
    preview: m.imageFront || m.image,
    printable: { x: 150, y: 150, width: 300, height: 400 }, // Default mapping to canvas layout
    colors: [
      { name: m.color || 'Black', hex: m.color === 'White' ? '#FFFFFF' : m.color === 'Red' ? '#FF0000' : m.color === 'Blue' ? '#0000FF' : m.color === 'Gray' ? '#808080' : '#000000' }
    ],
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 py-30 ">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-2 leading-none">
            <span className="text-[#ff5500]">Design</span>  Your Own Product
          </h1>
          <p className="text-gray-600">Choose a product and customize it with your design</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {[...Array(8)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : formattedMockups.length > 0 ? (
          <MockupGrid mockups={formattedMockups} />
        ) : (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
              Mockups <span className="text-[#ff5500]">Coming Soon</span>
            </h3>
            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-gray-500">
              The lab is currently cooking up new canvases. Stay tuned.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
