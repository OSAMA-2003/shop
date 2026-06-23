import React, { useRef } from 'react'
import { useMockup } from '../context/MockupContext'
import { Eye, Lock, ChevronRight, ChevronDown } from 'lucide-react'

export default function LayerPanel({
  activeSide = 'front',
  isOpen = true,
  onToggle
}: {
  activeSide?: 'front' | 'back';
  isOpen?: boolean;
  onToggle?: () => void;
}) {
  const { layers, selectedId, selectLayer, addLayer, deleteLayer } = useMockup()
  const fileRef = useRef<HTMLInputElement>(null)

  const sideLayers = layers.filter((layer) => layer.side === activeSide)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const reader = new FileReader()
    reader.onload = () => {
      const generatedId = addLayer({
        type: 'image',
        side: activeSide,
        src: reader.result as string,
        x: 150,
        y: 200,
        width: 200,
        height: 200,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      })
      selectLayer(generatedId)
    }
    reader.readAsDataURL(files[0])
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div
      className={`flex flex-col bg-[#F5F2EB] border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${isOpen ? 'h-full p-5' : 'h-16 overflow-hidden px-5 py-4 cursor-pointer hover:bg-black/5'
        }`}
      onClick={(e) => {
        if (!isOpen && onToggle) {
          onToggle();
        }
      }}
    >
      <div
        className="flex justify-between items-center mb-6 select-none cursor-pointer"
        onClick={(e) => {
          if (isOpen && onToggle) {
            e.stopPropagation();
            onToggle();
          }
        }}
      >
        <h2 className="font-black text-black text-xl uppercase tracking-wider">Layers</h2>
        {onToggle && <span className="font-black text-xl">{isOpen ? <ChevronDown size={24} /> : <ChevronRight size={24} />}</span>}
      </div>

      {isOpen && (
        <>
          <div className="flex-1 space-y-2 overflow-y-auto pr-2">
            {sideLayers.length === 0 ? (
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
              sideLayers.map((layer, idx) => {
                const isSelected = selectedId === layer.id
                return (
                  <div
                    key={layer.id}
                    onClick={(e) => { e.stopPropagation(); selectLayer(layer.id); }}
                    className={`flex items-center justify-between border-2 border-black rounded-lg p-3 cursor-pointer transition-all ${isSelected ? 'bg-[#FF5722] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-50'
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
          <div className="flex items-center flex-col gap-2 mt-4 pt-4 border-t-2 border-black border-dashed shrink-0">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <button
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ff5500] border-[3px] border-black text-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-[#ff5500] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
            >
              Add New Image
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); selectedId && deleteLayer(selectedId); }}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-black border-[3px] border-black hover:text-black text-sm font-black uppercase tracking-widest hover:bg-[#ff5500] text-[#ff5500] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
            >
              Delete Image
            </button>
          </div>
        </>
      )}
    </div>
  )
}