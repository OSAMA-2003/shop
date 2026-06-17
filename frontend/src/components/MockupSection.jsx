import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MockupGrid from './MockupGrid';
import { ShopContext } from '../context/ShopContenxt';

const MockupSection = () => {
  const navigate = useNavigate();
  const { all_mockups } = useContext(ShopContext);

  const formattedMockups = (all_mockups || []).slice(0, 4).map(m => ({
    id: m._id,
    name: m.name,
    preview: m.image,
    printable: { x: 150, y: 150, width: 300, height: 400 }, // Default relative box mapping
    colors: [
      { name: m.color || 'Black', hex: m.color === 'White' ? '#FFFFFF' : m.color === 'Red' ? '#FF0000' : m.color === 'Blue' ? '#0000FF' : m.color === 'Gray' ? '#808080' : '#000000' }
    ],
  }));

  return (
    <section className='relative w-full min-h-screen bg-background text-text-main py-32 px-6 sm:px-10 flex flex-col justify-center'>
      
      <div className='relative z-10 max-w-7xl mx-auto text-center w-full'>
        <h2 className='text-4xl sm:text-5xl font-extrabold mb-6'>Design Your Own Product</h2>
        <p className='text-text-muted mb-12 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed'>
          Bring your designs to life! Choose a product mockup and customize it with your own graphics, text, and colors.
        </p>

        <div className='mb-12 text-left'>
          {formattedMockups.length > 0 ? (
            <MockupGrid mockups={formattedMockups} />
          ) : (
            <p className="text-center font-bold text-gray-500 uppercase tracking-widest">Loading mockups...</p>
          )}
        </div>

        <button onClick={() => navigate('/mockups')} className='rounded-xl sm:w-auto bg-[#ff5500] text-white font-bold uppercase tracking-widest px-8 py-4 text-xs sm:text-sm hover:bg-[#e04a00] transition-colors duration-300'>
          View All Mockups
        </button>
      </div>
    </section>
  );
};

export default MockupSection;