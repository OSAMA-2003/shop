import React, { useRef } from 'react'
import { useMockup } from '../context/MockupContext'
import { Eye, Lock } from 'lucide-react'

export default function LayerPanel() {
  const { layers, selectedId, selectLayer, addLayer, deleteLayer } = useMockup()
  const fileRef = useRef<HTMLInputElement>(null)

  // Merged Upload logic directly into the layer panel actions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const reader = new FileReader()
    reader.onload = () => {
      const newLayerId = Date.now().toString()
      addLayer({
        id: newLayerId, type: 'image', src: reader.result as string,
        x: 150, y: 200, width: 200, height: 200, rotation: 0, scaleX: 1, scaleY: 1,
      })
      selectLayer(newLayerId)
    }
    reader.readAsDataURL(files[0])
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="flex flex-col  h-full bg-[#F5F2EB] border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="font-black text-black text-xl uppercase tracking-wider mb-6">Layers</h2>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {/* Mock static layers for aesthetic matching */}
        

        

        {/* Dynamic User Layers */}
        {layers.length === 0 ? (
          <div className={`flex items-center justify-between border-2 border-black rounded-lg p-3 cursor-pointer ${!selectedId ? 'bg-[#FF5722] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'}`}>
            <div>
              <div className="font-bold uppercase text-sm">Graphics</div>
              <div className="text-xs font-mono">(None)</div>
            </div>
            <div className="flex gap-2 text-black">
               <Eye size={18} /> <Lock size={18} />
            </div>
          </div>
        ) : (
          layers.map((layer, idx) => {
            const isSelected = selectedId === layer.id
            return (
              <div
                key={layer.id}
                onClick={() => selectLayer(layer.id)}
                className={`flex items-center justify-between border-2 border-black rounded-lg p-3 cursor-pointer transition-all ${
                  isSelected ? 'bg-[#FF5722] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-bold uppercase text-sm">Graphic {idx + 1}</div>
                  <div className="text-xs font-mono text-black/70">(Uploaded)</div>
                </div>
                <div className="flex gap-2 text-black">
                   <Eye size={18} /> <Lock size={18} />
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center flex-col gap-2 mt-4 pt-4">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        <button 
          onClick={() => fileRef.current?.click()}
className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ff5500] border-[3px] border-black text-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-[#ff5500] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"            >
        
          Add New Image
        </button>
        <button 
          onClick={() => selectedId && deleteLayer(selectedId)}
className="inline-flex items-center justify-center gap-2 px-10 py-4  bg-black border-[3px] border-black hover:text-black text-sm font-black uppercase tracking-widest hover:bg-[#ff5500] text-[#ff5500] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"            >
        
          Delete Image
        </button>
      </div>
    </div>
  )
}