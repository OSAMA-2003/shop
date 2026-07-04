import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContenxt';
import Footer from '../components/Footer';
import CardSkeleton from '../components/CardSkeleton';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const Collection = () => {
  const { all_products, loading } = useContext(ShopContext);
  const products = all_products || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-black font-sans">
      <div className="max-w-7xl mx-auto flex-grow w-full px-6 sm:px-10 pt-32 pb-20">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-2 leading-none text-black">
            The <span className="text-[#ff5500]">Collection</span>
          </h1>
          <p className="text-gray-600">Explore our premium raw canvases and custom apparel</p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <ShoppingBag className="w-16 h-16 text-black/45 mb-4 animate-bounce" />
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
              No Products <span className="text-[#ff5500]">Found</span>
            </h3>
            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-gray-500">
              Check back later for new arrivals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative bg-white border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col"
              >
                {/* Image Area - Brutalist grey with heavy bottom border */}
                <div className="aspect-square bg-[#e5e5e5] border-b-[4px] border-black p-8 overflow-hidden relative flex items-center justify-center">
                  {/* Subtle "Hover to View" brutalist badge */}
                  <div className='absolute top-3 left-3 bg-black text-white text-[10px] font-black uppercase px-2 py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity'>
                    Preview
                  </div>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-black text-2xl mb-6 text-black uppercase tracking-tighter leading-none">
                    {product.name}
                  </h3>

                  <div className="flex items-end justify-between mt-auto gap-4">
                    {/* Price on the left */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/50">Price</span>
                      <span className="text-2xl font-black tracking-tight text-[#ff5500]">
                        {Number(product.price).toFixed(2)} EGP
                      </span>
                    </div>

                    {/* Brutalist call-to-action button */}
                    <Link
                      to={`/product/${product._id}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#ff5500] border-[3px] border-black text-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-[#ff5500] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] cursor-pointer"
                    >
                      View <ArrowRight size={18} strokeWidth={3} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Collection;
