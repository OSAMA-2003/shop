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
    <div className="group relative bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden flex flex-col">
      
      {/* Image Area - Apple's signature #f5f5f7 surface background */}
      <div className="aspect-square bg-[#f5f5f7] p-8 overflow-hidden">
        <img 
          src={mockup.preview} 
          alt={mockup.name} 
          className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105" 
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Clean, tight tracking typography */}
        <h3 className="font-semibold text-xl mb-6 text-[#1d1d1f] tracking-tight">
          {mockup.name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          
          {/* Apple-style color swatches (circular with subtle inner shadow/ring) */}
          <div className="flex items-center gap-1.5">
            {mockup.colors.slice(0, 3).map((c: any) => (
              <div 
                key={c.name} 
                className="w-5 h-5 rounded-full ring-1 ring-inset ring-black/10 shadow-sm" 
                style={{ backgroundColor: c.hex }} 
              />
            ))}
            {mockup.colors.length > 3 && (
              <span className="text-xs font-medium text-gray-500 ml-1">
                +{mockup.colors.length - 3}
              </span>
            )}
          </div>
          
          {/* Apple-style pill button */}
          <Link
            to={`/mockups/${mockup.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0071e3] text-white text-sm font-medium rounded-full hover:bg-[#0077ED] hover:shadow-md transition-all duration-300 active:scale-95"
          >
            Customize <ArrowRight size={16} />
          </Link>

        </div>
      </div>
    </div>
  )
}