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
    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
        <Upload size={18} className="text-[#5A54F9]" /> Upload Image
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
        className="w-full px-4 py-3 bg-[#5A54F9] text-white font-bold rounded-lg hover:bg-[#4a45d9] transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        Choose Image
      </button>
      <p className="text-xs text-gray-400 mt-3 text-center font-medium">Supports JPG, PNG</p>
    </div>
  )
}