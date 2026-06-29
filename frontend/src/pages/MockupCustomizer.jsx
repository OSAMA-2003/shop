import React, { useState, useContext, useRef, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { MockupProvider, useMockup } from '../context/MockupContext'
import { ShopContext } from '../context/ShopContenxt'
import MockupCanvas from '../components/MockupCanvas'
import LayerPanel from '../components/LayerPanel'
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react'

// Replaces your TransformControls to match the "PRECISION CONTROLS" panel
// Replaces your current PrecisionControls in MockupCustomizer.jsx
function PrecisionControls({ isOpen = true, onToggle }) {
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
        <h3 className="font-black text-black text-xl uppercase tracking-wider">Precision Controls</h3>
        {onToggle && <span className="font-black text-xl">{isOpen ? <ChevronDown size={24} /> : <ChevronRight size={24} />}</span>}
      </div>

      {isOpen && (
        <>
          {/* Checkerboard Preview Area */}
          <div
            className="w-full h-32 border-2 border-black border-dashed mb-6 rounded-md relative flex items-center justify-center overflow-hidden shrink-0"
            style={{
              backgroundImage: 'repeating-conic-gradient(#E5E5E5 0% 25%, transparent 0% 50%)',
              backgroundSize: '16px 16px'
            }}
          >
            {selectedLayer?.src && (
              <img src={selectedLayer.src} alt="preview" className="max-h-full max-w-full object-contain" />
            )}
          </div>

          <div className={`flex-1 overflow-y-auto pr-2 ${!selectedLayer ? 'flex flex-col justify-center' : 'space-y-6'}`}>
            {!selectedLayer ? (
              <div className="border-2 border-black border-dashed rounded-lg p-5 bg-[#E5E5E5]/50 text-center my-auto flex flex-col justify-center items-center">
                <span className="font-black text-sm uppercase tracking-wider mb-2 text-black">No Graphic Selected</span>
                <p className="text-xs text-black/60 font-semibold leading-relaxed">
                  Select a graphic layer from the Layers panel or click it directly on the canvas to customize.
                </p>
              </div>
            ) : (
              <>
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
                    <div className="border-2 border-black rounded-md bg-white px-2 py-1 font-mono text-sm w-16 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {Math.round((selectedLayer?.scaleX ?? 1) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Rotation */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Rotation</label>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-black relative flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
                    <div className="border-2 border-black rounded-md bg-white px-2 py-1 font-mono text-sm w-16 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {Math.round((selectedLayer?.opacity ?? 1) * 100)}%
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}


function CustomizerContent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { all_mockups, addToCart, token, url, fetchCustomMockups } = useContext(ShopContext)
  const { layers, selectedId, selectLayer, addLayer, deleteLayer, updateLayer } = useMockup()

  const [activeSide, setActiveSide] = useState('front')
  const [selectedSize, setSelectedSize] = useState('M')
  const [isProcessing, setIsProcessing] = useState(false)
  const [openAccordion, setOpenAccordion] = useState('layers')
  const [activeMobileTab, setActiveMobileTab] = useState('upload')

  // Caching view image data URLs
  const [frontImgData, setFrontImgData] = useState(null)
  const [backImgData, setBackImgData] = useState(null)

  const mobileFileRef = useRef(null)
  const canvasRef = useRef(null)

  const handleSideSwitch = (side) => {
    if (side === activeSide) return

    // Capture active view to state cache before leaving it
    const currentImg = canvasRef.current?.exportImage()
    if (currentImg) {
      if (activeSide === 'front') {
        setFrontImgData(currentImg)
      } else {
        setBackImgData(currentImg)
      }
    }

    setActiveSide(side)
  }

  const selectedLayer = layers?.find((l) => l.id === selectedId)
  const sideLayers = (layers || []).filter((layer) => layer.side === activeSide)

  const backendMockup = (all_mockups || []).find(m => m._id === id)

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

  const handleMobileUpload = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new window.Image()
      img.src = reader.result
      img.onload = () => {
        const aspectRatio = img.width / img.height
        const targetHeight = 200
        const targetWidth = targetHeight * aspectRatio

        const generatedId = addLayer({
          type: 'image',
          side: activeSide,
          src: reader.result,
          x: mockup.printable.x + (mockup.printable.width / 2) - (targetWidth / 2),
          y: mockup.printable.y + (mockup.printable.height / 2) - (targetHeight / 2),
          width: img.width,
          height: img.height,
          rotation: 0,
          scaleX: targetWidth / img.width,
          scaleY: targetHeight / img.height,
        })
        selectLayer(generatedId)
      }
    }
    reader.readAsDataURL(files[0])
    if (mobileFileRef.current) mobileFileRef.current.value = ''
  }

  const handleMobileChange = (e) => {
    const { name, value } = e.target;
    if (updateLayer && selectedId) updateLayer(selectedId, { [name]: parseFloat(value) || 0 });
  };

  const handleMobileScaleChange = (e) => {
    const val = parseFloat(e.target.value) || 0.1;
    if (updateLayer && selectedId) {
      updateLayer(selectedId, { scaleX: val, scaleY: val });
    }
  };



  const [color, setColor] = useState('black')

  useEffect(() => {
    if (mockup?.colors?.[0]?.name) {
      setColor(mockup.colors[0].name)
    }
  }, [mockup])



  const availableSizes = backendMockup?.sizes && backendMockup.sizes.length > 0 ? backendMockup.sizes : ["S", "M", "L", "XL"];

  const handleExportPNG = () => {
    if (!mockup) return
    const currentImg = canvasRef.current?.exportImage()

    const frontImg = activeSide === 'front'
      ? currentImg
      : (frontImgData || mockup.previewFront || mockup.preview)

    const backImg = activeSide === 'back'
      ? currentImg
      : (backImgData || mockup.previewBack)

    if (frontImg) {
      const link = document.createElement('a')
      link.href = frontImg
      link.download = `${mockup.name || 'mockup'}-front.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    if (backImg) {
      const link = document.createElement('a')
      link.href = backImg
      link.download = `${mockup.name || 'mockup'}-back.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleSaveDesign = async (quiet = false) => {
    if (!mockup || !backendMockup) return null
    if (!token) {
      navigate('/login', { state: { from: `/mockups/${mockup.id}` } })
      return null
    }

    try {
      const currentImg = canvasRef.current?.exportImage()

      const frontImg = activeSide === 'front'
        ? currentImg
        : (frontImgData || mockup.previewFront || mockup.preview)

      const backImg = activeSide === 'back'
        ? currentImg
        : (backImgData || mockup.previewBack)

      if (!frontImg || !backImg) {
        if (!quiet) {
          alert('Failed to capture front or back view.')
        }
        return null
      }

      const uploadedImages = (layers || [])
        .filter((l) => l.type === 'image' && l.src && l.src.startsWith('data:'))
        .map((l) => l.src)

      const payload = {
        mockupId: mockup.id,
        name: mockup.name,
        price: backendMockup.price,
        color: color,
        size: selectedSize,
        imageFront: frontImg,
        imageBack: backImg,
        layers: layers || [],
        uploadedImages: uploadedImages
      }

      const res = await axios.post(`${url}/api/mockup/custom/save`, payload, {
        headers: { token }
      })

      if (res.data.success) {
        if (!quiet) {
          alert('Design saved successfully!')
        }
        await fetchCustomMockups(token)
        return res.data.data
      } else {
        alert('Failed to save design: ' + res.data.message)
        return null
      }
    } catch (err) {
      console.error(err)
      alert('Error saving design: ' + err.message)
      return null
    }
  }

  const handleSaveClick = async () => {
    setIsProcessing(true)
    try {
      await handleSaveDesign(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddToCart = async () => {
    if (!mockup) return
    if (!token) {
      navigate('/login', { state: { from: `/mockups/${mockup.id}` } })
      return
    }

    setIsProcessing(true)
    try {
      const savedDesign = await handleSaveDesign(true)
      if (!savedDesign) {
        setIsProcessing(false)
        return
      }

      await addToCart(savedDesign._id, 1, selectedSize)
      navigate('/cart')
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!mockup) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F5F2EB] font-sans text-black">
      <p className="text-2xl font-black uppercase tracking-widest animate-pulse">Loading Mockup...</p>
    </div>
  )

  return (
    <div className="h-[calc(100dvh-5rem)] mt-20 w-full flex flex-col lg:flex-row bg-[#F5F2EB] lg:p-10 gap-4 lg:gap-6 font-sans text-black overflow-hidden">

      {/* LEFT SIDEBAR: Layers (Desktop Only) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[330px] lg:shrink-0 lg:h-full">
        <LayerPanel
          activeSide={activeSide}
          isOpen={true}
          printable={mockup.printable}
        />
      </aside>

      {/* CENTER: Canvas Workspace */}
      <main className="flex-grow min-h-[180px] lg:min-h-0 m-4 lg:m-0 relative border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col">

        {/* VIEW TOGGLE TABS */}
        <div className="flex border-b-2 border-black shrink-0">
          <button
            onClick={() => handleSideSwitch('front')}
            className={`flex-1 py-3 font-black uppercase tracking-widest text-xs sm:text-sm transition-colors ${activeSide === 'front' ? 'bg-[#FF5722] text-black' : 'bg-[#E5E5E5] text-black/50 hover:bg-[#E5E5E5]/80 hover:text-black'}`}
          >
            Front View
          </button>
          <div className="w-[2px] bg-black"></div>
          <button
            onClick={() => handleSideSwitch('back')}
            className={`flex-1 py-3 font-black uppercase tracking-widest text-xs sm:text-sm transition-colors ${activeSide === 'back' ? 'bg-[#FF5722] text-black' : 'bg-[#E5E5E5] text-black/50 hover:bg-[#E5E5E5]/80 hover:text-black'}`}
          >
            Back View
          </button>
        </div>

        <div className="flex-1 w-full h-full relative">
          <MockupCanvas key={activeSide} ref={canvasRef} mockup={mockup} color={color} canvasSide={activeSide} currentActiveSide={activeSide} />
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR & CONTROLS (lg:hidden) */}
      <div className="lg:hidden flex flex-col bg-white border-t-4 border-black shrink-0 z-20 w-full  ">
        {/* Active Sheet Area */}
        {activeMobileTab && (
          <div className="h-[150px] border-b-2 border-black bg-[#F5F2EB] overflow-hidden relative">

            {/* Tab 1: Upload / Layers */}
            {activeMobileTab === 'upload' && (
              <div className="h-full flex flex-col p-4 bg-[#F5F2EB]">
                <div className="flex justify-between items-center mb-2 shrink-0">
                  <h4 className="font-black text-black text-sm uppercase tracking-wider">Upload Design / Layers</h4>
                  <span className="text-[10px] font-mono bg-black text-[#F5F2EB] px-2 py-0.5 rounded uppercase">
                    {activeSide} view
                  </span>
                </div>

                {/* Horizontal Scroll Area */}
                <div className="flex-1 flex gap-4 overflow-x-auto py-2 items-center pr-4">
                  {/* Upload Card */}
                  <div
                    onClick={() => mobileFileRef.current?.click()}
                    className="w-18 h-18 shrink-0 border-2 border-dashed border-black rounded-xl bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <input
                      ref={mobileFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleMobileUpload}
                      className="hidden"
                    />
                    <span className="text-3xl font-black text-[#FF5722]">+</span>
                    <span className="text-[9px] font-black uppercase text-black/60 mt-1">Upload</span>
                  </div>

                  {/* Layers List */}
                  {sideLayers.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center border-2 border-black border-dashed rounded-xl h-18 bg-white/50 text-center px-4">
                      <p className="text-[10px] font-bold text-black/50 uppercase tracking-wider">No designs uploaded yet</p>
                    </div>
                  ) : (
                    sideLayers.map((layer, idx) => {
                      const isSelected = selectedId === layer.id
                      return (
                        <div
                          key={layer.id}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            selectLayer(layer.id)
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            selectLayer(layer.id)
                          }}
                          className={`w-18 h-18 shrink-0 border-2 border-black rounded-xl bg-white relative overflow-hidden cursor-pointer transition-all flex items-center justify-center p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isSelected ? 'ring-4 ring-[#FF5722] scale-95' : 'hover:scale-95'
                            }`}
                        >
                          <img src={layer.src} alt="layer thumbnail" className="max-h-full max-w-full object-contain" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLayer(layer.id);
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-black border border-black rounded-full flex items-center justify-center text-white text-[10px] hover:bg-red-500 font-black"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}



            {/* Tab 3: Sizes */}
            {activeMobileTab === 'sizes' && (
              <div className="h-full p-4 flex flex-col justify-center bg-[#F5F2EB]">
                <div className="text-center mb-4">
                  <h4 className="font-black text-black text-sm uppercase tracking-wider mb-1">Choose Apparel Size</h4>
                  <p className="text-[10px] text-black/50 uppercase tracking-widest font-bold">Standard unisex sizing applies</p>
                </div>
                <div className="flex gap-3 justify-center items-center">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center border-[3px] border-black font-black text-sm transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 ${selectedSize === size ? 'bg-[#FF5722] text-black' : 'bg-white text-black hover:bg-black/5'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* BOTTOM DOCKED NAVIGATION BUTTONS BAR */}
        <nav className="h-16 flex border-b-2 border-black bg-white select-none shrink-0">
          {/* Upload Button Tab */}
          <button
            onClick={() => setActiveMobileTab(activeMobileTab === 'upload' ? null : 'upload')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 border-r-2 border-black transition-colors ${activeMobileTab === 'upload' ? 'bg-[#FF5722] text-black' : 'bg-[#F5F2EB] text-black/60 hover:text-black'
              }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-wider">Upload</span>
          </button>



          {/* Sizes Button Tab */}
          <button
            onClick={() => setActiveMobileTab(activeMobileTab === 'sizes' ? null : 'sizes')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 border-r-2 border-black transition-colors ${activeMobileTab === 'sizes' ? 'bg-[#FF5722] text-black' : 'bg-[#F5F2EB] text-black/60 hover:text-black'
              }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2m12 0h-2a2 2 0 00-2 2v2M4 16v2a2 2 0 002 2h2m12 0h-2a2 2 0 01-2-2v-2m-9-4h4" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-wider">Sizes</span>
          </button>

          {/* Export Action Button */}
          <button
            onClick={handleExportPNG}
            disabled={isProcessing}
            className="flex-1 flex flex-col items-center justify-center gap-1 border-r-2 border-black bg-[#F5F2EB] text-black/60 hover:text-black transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-wider">Export</span>
          </button>

          {/* Add to Cart Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={isProcessing}
            className="flex-[1.2] flex flex-col items-center justify-center gap-1 bg-[#FF5722] text-black hover:bg-[#E64A19] transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
            <span className="text-[9px] font-black uppercase tracking-wider">Cart</span>
          </button>
        </nav>

      </div>

      {/* RIGHT SIDEBAR: Select Size & Actions (Desktop Only) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[340px] lg:shrink-0 lg:gap-6 lg:overflow-y-auto lg:pr-2 lg:h-full">
        {/* SELECT SIZE */}
        <div className="bg-[#F5F2EB] border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-black text-black text-lg uppercase tracking-wider mb-3">Select Size</h3>
          <div className="flex gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-10 h-10 flex items-center justify-center border-2 border-black font-black text-sm transition-colors ${selectedSize === size ? 'bg-[#FF5722] text-black' : 'bg-white text-black hover:bg-black/5'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isProcessing}
            className="w-full bg-[#FF5722] hover:bg-[#E64A19] disabled:bg-gray-400 disabled:cursor-not-allowed text-black border-2 border-black rounded-xl py-4 font-black text-lg uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Processing...
              </>
            ) : (
              'Add Design to Cart'
            )}
          </button>

          <button
            onClick={handleExportPNG}
            disabled={isProcessing}
            className="w-full bg-white text-black disabled:bg-gray-200 disabled:cursor-not-allowed border-2 border-black rounded-xl py-4 font-black text-lg uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all hover:bg-black/5 flex items-center justify-center gap-2"
          >
            Export PNG
          </button>
        </div>
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