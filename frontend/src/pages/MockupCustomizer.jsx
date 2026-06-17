import React, { useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MockupProvider, useMockup } from '../context/MockupContext'
import { ShopContext } from '../context/ShopContenxt'
import MockupCanvas from '../components/MockupCanvas'
import LayerPanel from '../components/LayerPanel'

// Replaces your TransformControls to match the "PRECISION CONTROLS" panel
// Replaces your current PrecisionControls in MockupCustomizer.jsx
function PrecisionControls() {
  const { layers, selectedId, updateLayer } = useMockup()
  const selectedLayer = layers?.find((l) => l.id === selectedId)

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (updateLayer && selectedId) updateLayer(selectedId, { [name]: parseFloat(value) || 0 });
  };

  // Custom handler for scale so we update both X and Y simultaneously to keep aspect ratio
  const handleScaleChange = (e) => {
    const val = parseFloat(e.target.value) || 0.1;
    if (updateLayer && selectedId) {
      updateLayer(selectedId, { scaleX: val, scaleY: val });
    }
  };

  return (
    <div className="flex flex-col  h-full bg-[#F5F2EB] border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="font-black text-black text-xl uppercase tracking-wider mb-4">Precision Controls</h3>
      
      {/* Checkerboard Preview Area */}
      <div 
        className="w-full h-32 border-2 border-black border-dashed mb-6 rounded-md relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'repeating-conic-gradient(#E5E5E5 0% 25%, transparent 0% 50%)',
          backgroundSize: '16px 16px'
        }}
      >
        {selectedLayer?.src && (
          <img src={selectedLayer.src} alt="preview" className="max-h-full max-w-full object-contain" />
        )}
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {/* Position */}
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Position</label>
          <div className="flex gap-4">
            <div className="flex items-center border-2 border-black rounded-md bg-white overflow-hidden flex-1">
              <span className="px-3 border-r-2 border-black font-bold text-sm bg-[#F5F2EB]">X:</span>
              <input type="number" name="x" value={Math.round(selectedLayer?.x || 0)} onChange={handleChange} disabled={!selectedLayer} className="w-full px-2 py-1 text-sm outline-none bg-transparent font-mono" />
            </div>
            <div className="flex items-center border-2 border-black rounded-md bg-white overflow-hidden flex-1">
              <span className="px-3 border-r-2 border-black font-bold text-sm bg-[#F5F2EB]">Y:</span>
              <input type="number" name="y" value={Math.round(selectedLayer?.y || 0)} onChange={handleChange} disabled={!selectedLayer} className="w-full px-2 py-1 text-sm outline-none bg-transparent font-mono" />
            </div>
          </div>
        </div>

        {/* Scale / Size Slider */}
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Scale</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" min="0.1" max="3" step="0.05" 
              value={selectedLayer?.scaleX ?? 1} 
              onChange={handleScaleChange} 
              disabled={!selectedLayer}
              className="flex-1 accent-[#FF5722] cursor-pointer" 
            />
            <div className="border-2 border-black rounded-md bg-white px-2 py-1 font-mono text-sm w-16 text-center">
              {Math.round((selectedLayer?.scaleX ?? 1) * 100)}%
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Rotation</label>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-black relative flex items-center justify-center bg-white">
              <div className="w-1 h-4 bg-black absolute top-1 rounded-full" style={{ transform: `rotate(${selectedLayer?.rotation || 0}deg)`, transformOrigin: 'bottom center' }}></div>
            </div>
            <div className="flex items-center border-2 border-black rounded-md bg-white overflow-hidden w-24">
              <input type="number" name="rotation" value={Math.round(selectedLayer?.rotation || 0)} onChange={handleChange} disabled={!selectedLayer} className="w-full px-2 py-1 text-sm outline-none bg-transparent font-mono text-center" />
              <span className="pr-2 font-bold text-sm bg-white">°</span>
            </div>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Opacity</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" min="0" max="1" step="0.1" name="opacity" 
              value={selectedLayer?.opacity ?? 1} 
              onChange={handleChange} 
              disabled={!selectedLayer}
              className="flex-1 accent-[#FF5722] cursor-pointer" 
            />
            <div className="border-2 border-black rounded-md bg-white px-2 py-1 font-mono text-sm w-16 text-center">
              {Math.round((selectedLayer?.opacity ?? 1) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 pt-4 border-t-2 border-black border-dashed">
      </div>
    </div>
  )
}


function CustomizerContent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { all_mockups } = useContext(ShopContext)
  
  const backendMockup = (all_mockups || []).find(m => m._id === id)
  
  const [activeSide, setActiveSide] = useState('front')

  const mockup = backendMockup ? {
    id: backendMockup._id,
    name: backendMockup.name,
    previewFront: backendMockup.imageFront,
    previewBack: backendMockup.imageBack,
    preview: activeSide === 'front' ? (backendMockup.imageFront || backendMockup.image) : backendMockup.imageBack,
    printable: { x: 150, y: 150, width: 300, height: 400 }, // Default relative box mapping
    colors: [
      { name: backendMockup.color || 'Black', hex: backendMockup.color === 'White' ? '#FFFFFF' : backendMockup.color === 'Red' ? '#FF0000' : backendMockup.color === 'Blue' ? '#0000FF' : backendMockup.color === 'Gray' ? '#808080' : '#000000' }
    ],
  } : null;

  // Default to black or the first available color
  const [color, setColor] = useState(mockup?.colors?.[0]?.name || 'black')

  if (!mockup) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F5F2EB] font-sans text-black">
      <p className="text-2xl font-black uppercase tracking-widest animate-pulse">Loading Mockup...</p>
    </div>
  )

  return (
    <div className="h-screen  mt-20 w-full flex bg-[#F5F2EB]   p-10 gap-6 font-sans text-black overflow-hidden">
      
      {/* LEFT SIDEBAR: Layers */}
      <aside className="w-[320px] flex flex-col shrink-0">
        <LayerPanel />
        
      
      </aside>

      {/* CENTER: Canvas Workspace */}
      <main className="flex-1 relative border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col">
        
        {/* VIEW TOGGLE TABS */}
        <div className="flex border-b-2 border-black shrink-0">
          <button 
              onClick={() => setActiveSide('front')}
              className={`flex-1 py-3 font-black uppercase tracking-widest text-sm transition-colors ${activeSide === 'front' ? 'bg-[#FF5722] text-black' : 'bg-[#E5E5E5] text-black/50 hover:bg-[#E5E5E5]/80 hover:text-black'}`}
          >
              Front View
          </button>
          <div className="w-[2px] bg-black"></div>
          <button 
              onClick={() => setActiveSide('back')}
              className={`flex-1 py-3 font-black uppercase tracking-widest text-sm transition-colors ${activeSide === 'back' ? 'bg-[#FF5722] text-black' : 'bg-[#E5E5E5] text-black/50 hover:bg-[#E5E5E5]/80 hover:text-black'}`}
          >
              Back View
          </button>
        </div>

        <div className="flex-1 w-full h-full relative">
          <MockupCanvas mockup={mockup} color={color} />
        </div>
      </main>

      {/* RIGHT SIDEBAR: Controls & Preview */}
      <aside className="w-[340px] flex flex-col shrink-0 gap-6">
        <PrecisionControls />
        
        <button className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-black border-2 border-black rounded-xl py-6 font-black text-xl uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all">
          Preview On Model
        </button>
      </aside>

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