import React from 'react'
import { useMockup } from '../context/MockupContext'
import { Trash2, CopyPlus, ArrowUp, ArrowDown } from 'lucide-react'

export default function LayerPanel() {
  const { layers, selectedId, selectLayer, bringForward, sendBackward, duplicateLayer, deleteLayer } = useMockup()

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-3">Layers ({layers.length})</h3>
      <div className="space-y-2 max-h-64 overflow-auto">
        {layers.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No layers yet</p>
        ) : (
          layers.map((layer, idx) => (
            <div
              key={layer.id}
              className={`flex items-center justify-between p-2 rounded border transition-colors ${
                selectedId === layer.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div
                onClick={() => selectLayer(layer.id)}
                className="flex-1 cursor-pointer text-sm font-medium"
              >
                {layer.type === 'image' ? '🖼️ Image' : '📝 Text'} {idx + 1}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => bringForward(layer.id)}
                  className="p-1 hover:bg-blue-200 rounded"
                  title="Bring forward"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => sendBackward(layer.id)}
                  className="p-1 hover:bg-blue-200 rounded"
                  title="Send backward"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => duplicateLayer(layer.id)}
                  className="p-1 hover:bg-green-200 rounded"
                  title="Duplicate"
                >
                  <CopyPlus size={14} />
                </button>
                <button
                  onClick={() => deleteLayer(layer.id)}
                  className="p-1 hover:bg-red-200 rounded text-red-600"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
