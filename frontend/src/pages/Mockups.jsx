import React from 'react'
import { Link } from 'react-router-dom'
import MockupGrid from '../components/MockupGrid'
import mockup1 from '../assets/mockups/front-black-mockup.png'
import mockup2 from '../assets/mockups/back-black-mockup.png'
import mockup3 from '../assets/mockups/white-front-mockup.png'

// Mockup registry - in production, fetch from API
const mockups = [
  {
    id: 'tshirt-front',
    name: 'T-Shirt Front',
    preview: mockup1,
    printable: { x: 120, y: 160, width: 520, height: 640 },
    colors: [
      { name: 'white', hex: '#FFFFFF' },
      { name: 'black', hex: '#000000' },
      { name: 'red', hex: '#FF0000' },
    ],
  },
  {
    id: 'tshirt-back',
    name: 'T-Shirt Back',
    preview: mockup2,
    printable: { x: 120, y: 160, width: 520, height: 640 },
    colors: [
      { name: 'white', hex: '#FFFFFF' },
      { name: 'black', hex: '#000000' },
    ],
  },
  {
    id: 'mug',
    name: 'Coffee Mug',
    preview: mockup3,
    printable: { x: 100, y: 140, width: 560, height: 680 },
    colors: [
      { name: 'white', hex: '#FFFFFF' },
      { name: 'black', hex: '#000000' },
    ],
  },
  {
    id: 'hoodie',
    name: 'Hoodie Front',
    preview: mockup1,
    printable: { x: 100, y: 140, width: 560, height: 680 },
    colors: [
      { name: 'navy', hex: '#001F3F' },
      { name: 'gray', hex: '#808080' },
    ],
  },
]

export default function Mockups() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 py-30 ">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-2 leading-none">
            Design Your Product
          </h1>
          <p className="text-gray-600">Choose a product and customize it with your design</p>
        </div>
        <MockupGrid mockups={mockups} />
      </div>
    </div>
  )
}
