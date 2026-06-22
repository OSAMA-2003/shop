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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {mockups.map((m) => (
        <div key={m.id} className="w-full">
          <MockupCard mockup={m} />
        </div>
      ))}
    </div>
  )
}