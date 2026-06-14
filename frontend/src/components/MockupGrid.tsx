import React from 'react'
import MockupCard from './MockupCard'

interface Mockup {
  id: string
  name: string
  preview: string
  printable: { x: number; y: number; width: number; height: number }
  colors: any[]
}

export default function MockupGrid({ mockups }: { mockups: Mockup[] }) {
  return (
    // 1. Flex layout with horizontal scrolling
    // 2. Hide scrollbars for a clean look
    // 3. Enable horizontal scroll snapping
    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 md:px-0">
      
      {mockups.map((m) => (
        // 4. Wrap the card to enforce dimensions and snap behavior
        <div 
          key={m.id} 
          className="snap-center shrink-0 w-[80vw] sm:w-[320px] lg:w-[400px]"
        >
          <MockupCard mockup={m} />
        </div>
      ))}

    </div>
  )
}