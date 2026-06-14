import React, { useRef } from 'react'
import { useMockup } from '../context/MockupContext'
import { Download, Save } from 'lucide-react'

export default function ExportButton({ mockup }: { mockup: any }) {
  const { layers } = useMockup()
  const stageRef = useRef<any>(null)

  function handleExport() {
    // For now, show a success message. In production, integrate with canvas export
    alert('Export feature ready! Layer count: ' + layers.length)
  }

  function handleSave() {
    const design = {
      mockupId: mockup.id,
      side: 'front',
      color: 'white',
      layers: layers,
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage for demo
    const designId = `design:${mockup.id}:${Date.now()}`
    localStorage.setItem(designId, JSON.stringify(design))
    alert('Design saved successfully!')
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-3">Export</h3>
      <div className="space-y-2">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Save size={18} /> Save Design
        </button>
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          <Download size={18} /> Export PNG
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Designs are saved to your browser's local storage
      </p>
    </div>
  )
}
