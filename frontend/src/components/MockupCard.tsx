import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface Mockup {
  id: string
  name: string
  preview: string
  printable: { x: number; y: number; width: number; height: number }
  colors: any[]
}

export default function MockupCard({ mockup }: { mockup: Mockup }) {
  return (
    <div className="group relative bg-white border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col">
      
      {/* Image Area - Brutalist grey with heavy bottom border */}
      <div className="aspect-square bg-[#e5e5e5] border-b-[4px] border-black p-8 overflow-hidden relative flex items-center justify-center">
        {/* Subtle "Hover to View" brutalist badge */}
        <div className='absolute top-3 left-3 bg-black text-white text-[10px] font-black uppercase px-2 py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity'>
          Preview
        </div>
        
        <img 
          src={mockup.preview} 
          alt={mockup.name} 
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110" 
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Heavy, tight tracking typography */}
        <h3 className="font-black text-2xl mb-6 text-black uppercase tracking-tighter leading-none">
          {mockup.name}
        </h3>
        
        <div className="flex items-end justify-between mt-auto gap-4">
          
          {/* Square, heavy-bordered color swatches */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/50">Colors</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {mockup.colors.slice(0, 3).map((c: any) => (
                <div 
                  key={c.name} 
                  className="w-6 h-6 border-[3px] border-black" 
                  style={{ backgroundColor: c.hex }} 
                  title={c.name}
                />
              ))}
              {mockup.colors.length > 3 && (
                <span className="text-xs font-black text-black ml-1">
                  +{mockup.colors.length - 3}
                </span>
              )}
            </div>
          </div>
          
          {/* Brutalist call-to-action button */}
          <Link
            to={`/mockups/${mockup.id}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#ff5500] border-[3px] border-black text-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-[#ff5500] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]">
            Design <ArrowRight size={18} strokeWidth={3} />
          </Link>

        </div>
      </div>
    </div>
  )
}