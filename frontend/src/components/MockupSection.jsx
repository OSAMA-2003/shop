import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MockupGrid from './MockupGrid';
import { ShopContext } from '../context/ShopContenxt';
import CardSkeleton from './CardSkeleton';

const MockupSection = () => {
  const navigate = useNavigate();
  const { all_mockups } = useContext(ShopContext);

  const formattedMockups = (all_mockups || []).slice(0, 4).map(m => ({
    id: m._id,
    name: m.name,
    preview: m.imageFront || m.image,
    printable: { x: 150, y: 150, width: 300, height: 400 }, // Default relative box mapping
    colors: [
      { name: m.color || 'Black', hex: m.color === 'White' ? '#FFFFFF' : m.color === 'Red' ? '#FF0000' : m.color === 'Blue' ? '#0000FF' : m.color === 'Gray' ? '#808080' : '#000000' }
    ],
  }));

  return (
    <section className='relative w-full min-h-screen bg-background text-text-main py-12 px-6 sm:px-10 flex flex-col justify-center'>
      
      <div className='relative z-10 max-w-7xl mx-auto text-center w-full'>
       
        <h2 className='text-6xl sm:text-7xl font-black uppercase  text-center tracking-tighter mb-4 leading-none'>
              <span className="text-[#ff5500]">Design</span>  Your Own Product
          </h2>
       
        <p className='text-text-muted mb-12 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed'>
          Bring your designs to life! Choose a product mockup and customize it with your own graphics, text, and colors.
        </p>

        <div className='mb-12 text-left'>
          {formattedMockups.length > 0 ? (
            <MockupGrid mockups={formattedMockups} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          )}
        </div>

        <button onClick={() => navigate('/mockups')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#ff5500] border-[3px] border-black text-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-[#ff5500] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]">
          View All Mockups
        </button>
      </div>
    </section>
  );
};

export default MockupSection;