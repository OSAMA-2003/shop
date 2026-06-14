import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MockupProvider, useMockup } from '../context/MockupContext'
import MockupCanvas from '../components/MockupCanvas'
import UploadPanel from '../components/UploadPanel'
import LayerPanel from '../components/LayerPanel'
import TextEditor from '../components/TextEditor'
import Toolbar from '../components/Toolbar'
import ExportButton from '../components/ExportButton'
import { ChevronLeft } from 'lucide-react'

import mockup1 from '../assets/mockups/front-black-mockup.png'
import mockup2 from '../assets/mockups/back-black-mockup.png'
import mockup3 from '../assets/mockups/white-front-mockup.png'

function TransformControls() {
  const { layers, selectedId, updateLayer } = useMockup()
  const selectedLayer = layers?.find((l) => l.id === selectedId)

  // Only show this panel when a layer is actually selected
  if (!selectedLayer) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (updateLayer) updateLayer(selectedId, { [name]: parseFloat(value) || 0 });
  };

  const handleScaleChange = (e) => {
    const val = parseFloat(e.target.value) || 0.1;
    // Update both scaleX and scaleY together to maintain the image's aspect ratio
    if (updateLayer) updateLayer(selectedId, { scaleX: val, scaleY: val });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <h3 className="font-semibold text-gray-700 border-b pb-2">Precise Controls</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">X Position</label>
          <input type="number" name="x" value={Math.round(selectedLayer.x || 0)} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Y Position</label>
          <input type="number" name="y" value={Math.round(selectedLayer.y || 0)} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Scale / Size</label>
          <input type="number" name="scale" step="0.1" value={Number(selectedLayer.scaleX || 1).toFixed(2)} onChange={handleScaleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Rotation (°)</label>
          <input type="number" name="rotation" value={Math.round(selectedLayer.rotation || 0)} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
    </div>
  )
}

const mockupRegistry = {
  'tshirt-front': {
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
  'tshirt-back': {
    id: 'tshirt-back',
    name: 'T-Shirt Back',
    preview: mockup2,
    printable: { x: 120, y: 160, width: 520, height: 640 },
    colors: [
      { name: 'white', hex: '#FFFFFF' },
      { name: 'black', hex: '#000000' },
    ],
  },
  mug: {
    id: 'mug',
    name: 'Coffee Mug',
    preview: mockup3,
    printable: { x: 50, y: 50, width: 560, height: 450 },
    colors: [
      { name: 'white', hex: '#FFFFFF' },
      { name: 'black', hex: '#000000' },
    ],
  },
  hoodie: {
    id: 'hoodie',
    name: 'Hoodie Front',
    preview: mockup1,
    printable: { x: 100, y: 100, width: 560, height: 680 },
    colors: [
      { name: 'navy', hex: '#001F3F' },
      { name: 'gray', hex: '#808080' },
    ],
  },
}

function CustomizerContent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mockup = mockupRegistry[id || 'tshirt-front']
  const [color, setColor] = useState(mockup?.colors[0]?.name || 'white')

  if (!mockup) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Mockup not found</h1>
          <button
            onClick={() => navigate('/mockups')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Mockups
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/mockups')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <h1 className="text-2xl font-bold">{mockup.name}</h1>
          <div className="w-32" />
        </div>

        {/* Color Selector */}
        <div className="mb-6 flex items-center gap-4">
          <span className="font-semibold">Product Color:</span>
          <div className="flex gap-3">
            {mockup.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                className={`w-10 h-10 rounded-full border-2 ${
                  color === c.name ? 'border-gray-900 ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <MockupCanvas mockup={mockup} color={color} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <UploadPanel />
            <TextEditor />
            <LayerPanel />
            <TransformControls />
            <Toolbar />
            <ExportButton mockup={mockup} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MockupCustomizer() {
  return (
    <MockupProvider>
      <CustomizerContent />
    </MockupProvider>
  )
}
