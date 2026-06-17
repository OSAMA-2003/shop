import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import MockupGrid from '../components/MockupGrid'
import { ShopContext } from '../context/ShopContenxt'

export default function Mockups() {
  const { all_mockups } = useContext(ShopContext);

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
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-2 leading-none">
            Design Your Product
          </h1>
          <p className="text-gray-600">Choose a product and customize it with your design</p>
        </div>
        {formattedMockups.length === 0 ? (
           <p className="text-xl font-bold uppercase tracking-widest text-black/50 py-10 text-center border-[3px] border-black border-dashed">No mockups available.</p>
        ) : (
          <MockupGrid mockups={formattedMockups} />
        )}
      </div>
    </div>
  )
}
