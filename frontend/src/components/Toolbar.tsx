import React from 'react'
import { useMockup } from '../context/MockupContext'
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'

export default function Toolbar() {
  const { undo, redo, setScale, scale } = useMockup()

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-3">Tools</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={undo}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw size={16} /> Undo
        </button>
        <button
          onClick={redo}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <RotateCw size={16} /> Redo
        </button>
        <button
          onClick={() => setScale(Math.min(3, scale * 1.2))}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => setScale(Math.max(0.5, scale / 1.2))}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">Zoom: {(scale * 100).toFixed(0)}%</p>
    </div>
  )
}
