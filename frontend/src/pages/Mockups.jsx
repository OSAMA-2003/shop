import React, { useContext } from 'react';
import MockupGrid from '../components/MockupGrid';
import { ShopContext } from '../context/ShopContenxt';
import CardSkeleton from '../components/CardSkeleton';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

export default function Mockups() {
  const { t, i18n } = useTranslation();
  const { all_mockups, loading } = useContext(ShopContext);
  const isRTL = i18n.language === 'ar';

  const formattedMockups = (all_mockups || []).map(m => ({
    id: m._id,
    name: m['name_' + i18n.language] || m.name,
    preview: m.imageFront || m.image,
    printable: { x: 150, y: 150, width: 300, height: 400 },
    colors: [
      { name: m.color || 'Black', hex: m.color === 'White' ? '#FFFFFF' : m.color === 'Red' ? '#FF0000' : m.color === 'Blue' ? '#0000FF' : m.color === 'Gray' ? '#808080' : '#000000' }
    ],
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-black font-sans">
      <div className="max-w-7xl mx-auto flex-grow w-full px-6 sm:px-10 pt-32 pb-20">
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-2 leading-none text-black">
            {isRTL ? (
              <>صمم <span className="text-[#ff5500]">منتجك</span> بنفسك</>
            ) : (
              <><span className="text-[#ff5500]">Design</span> Your Own Product</>
            )}
          </h1>
          <p className="text-gray-600">{t('mockups.subtitle')}</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : formattedMockups.length > 0 ? (
          <MockupGrid mockups={formattedMockups} />
        ) : (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
              {isRTL ? <>النماذج <span className="text-[#ff5500]">قريباً</span></> : <>Mockups <span className="text-[#ff5500]">Coming Soon</span></>}
            </h3>
            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-gray-500">
              {t('mockups.comingSoon')}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
