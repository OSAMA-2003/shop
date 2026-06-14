import React from 'react';
import { useNavigate } from 'react-router-dom';
import MockupGrid from './MockupGrid';
import mockup1 from '../assets/mockups/front-black-mockup.png';
import mockup2 from '../assets/mockups/back-black-mockup.png';
import mockup3 from '../assets/mockups/white-front-mockup.png';

const mockups = [
  {
    id: 'tshirt-front',
    name: 'T-Shirt Front',
    preview: mockup1,
    colors: [
      { name: 'white', hex: '#FFFFFF' },
      { name: 'black', hex: '#000000' },
    ],
  },
  {
    id: 'tshirt-back',
    name: 'T-Shirt Back',
    preview: mockup2,
    colors: [
      { name: 'white', hex: '#FFFFFF' },
      { name: 'black', hex: '#000000' },
    ],
  },
  {
    id: 'mug',
    name: 'White shirt',
    preview: mockup3,
    colors: [
      { name: 'white', hex: '#FFFFFF' },
      { name: 'black', hex: '#000000' },
    ],
  },
  {
    id: 'hoodie',
    name: 'Hoodie Front',
    preview: mockup1,
    colors: [
      { name: 'navy', hex: '#001F3F' },
      { name: 'gray', hex: '#808080' },
    ],
  },
];

const MockupSection = () => {
  const navigate = useNavigate();

  return (
    <section className='relative w-full min-h-screen bg-background text-text-main py-32 px-6 sm:px-10 flex flex-col justify-center'>
      
      <div className='relative z-10 max-w-7xl mx-auto text-center w-full'>
        <h2 className='text-4xl sm:text-5xl font-extrabold mb-6'>Design Your Own Product</h2>
        <p className='text-text-muted mb-12 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed'>
          Bring your designs to life! Choose a product mockup and customize it with your own graphics, text, and colors.
        </p>

        <div className='mb-12 text-left'>
          <MockupGrid mockups={mockups} />
        </div>

        <button onClick={() => navigate('/mockups')} className='rounded-xl sm:w-auto bg-[#ff5500] text-white font-bold uppercase tracking-widest px-8 py-4 text-xs sm:text-sm hover:bg-[#e04a00] transition-colors duration-300'>
          View All Mockups
        </button>
      </div>
    </section>
  );
};

export default MockupSection;