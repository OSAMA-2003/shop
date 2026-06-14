import React, { useRef } from 'react'
import { useMockup } from '../context/MockupContext'
import { Upload } from 'lucide-react'

export default function UploadPanel() {
  const fileRef = useRef(null)
  // Bring in selectLayer from your context
  const { addLayer, selectLayer } = useMockup()

  function handleFileSelect(e) {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = () => {
      const dataUrl = reader.result
      const newLayerId = Date.now().toString() // Create ID first

      addLayer({
        id: newLayerId,
        type: 'image',
        src: dataUrl,
        x: 150, // Starting coordinates (adjust based on your printable area)
        y: 150, 
        width: 200, // Give it a solid starting size
        height: 200,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      })

      // Immediately select the newly uploaded image so the handles appear!
      selectLayer(newLayerId)
    }

    reader.readAsDataURL(file)

    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Upload size={18} /> Upload Image
      </h3>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full px-4 py-2 bg-[#5A54F9] text-white rounded hover:bg-opacity-90 transition-colors"
      >
        Choose Image
      </button>
      <p className="text-xs text-gray-500 mt-2 text-center">Supports JPG, PNG</p>
    </div>
  )
}