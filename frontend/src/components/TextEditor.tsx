import React, { useState } from 'react'
import { useMockup } from '../context/MockupContext'
import { Type } from 'lucide-react'

export default function TextEditor() {
  const { addLayer } = useMockup()
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(32)
  const [color, setColor] = useState('#000000')
  const [fontFamily, setFontFamily] = useState('Arial')

  function handleAddText() {
    if (text.trim()) {
      addLayer({
        type: 'text',
        text,
        x: 200,
        y: 200,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        fontSize,
        fill: color,
        fontFamily,
      })
      setText('')
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Type size={18} /> Add Text
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="w-full px-3 py-2 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Math.max(8, Number(e.target.value)))}
              min="8"
              max="120"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option>Arial</option>
            <option>Helvetica</option>
            <option>Times New Roman</option>
            <option>Courier New</option>
            <option>Verdana</option>
            <option>Georgia</option>
          </select>
        </div>

        <button
          onClick={handleAddText}
          disabled={!text.trim()}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Text
        </button>
      </div>
    </div>
  )
}
