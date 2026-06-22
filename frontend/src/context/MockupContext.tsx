import React, { createContext, useContext, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface Layer {
  id: string
  type: 'image' | 'text'
  side?: 'front' | 'back'
  src?: string // for images
  text?: string // for text
  x: number
  y: number
  width?: number
  height?: number
  rotation: number
  scaleX: number
  scaleY: number
  offsetX?: number
  offsetY?: number
  fontSize?: number
  fill?: string
  fontFamily?: string
}

export interface Design {
  mockupId: string
  side: string
  color: string
  layers: Layer[]
}

interface MockupContextType {
  layers: Layer[]
  selectedId: string | null
  history: Design[]
  historyIndex: number
  scale: number
  addLayer: (layer: Omit<Layer, 'id'>) => string
  updateLayer: (id: string, updates: Partial<Layer>) => void
  deleteLayer: (id: string) => void
  selectLayer: (id: string | null) => void
  bringForward: (id: string) => void
  sendBackward: (id: string) => void
  duplicateLayer: (id: string) => void
  setScale: (scale: number) => void
  undo: () => void
  redo: () => void
  saveDesign: (design: Design) => void
  clearLayers: () => void
}

const MockupContext = createContext<MockupContextType | undefined>(undefined)

export function MockupProvider({ children }: { children: React.ReactNode }) {
  const [layers, setLayers] = useState<Layer[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [history, setHistory] = useState<Design[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [scale, setScale] = useState(1)

  const addLayer = useCallback((layer: Omit<Layer, 'id'>) => {
    const id = uuidv4()
    setLayers((prev) => [...prev, { side: 'front', ...layer, id }])
    return id
  }, [])

  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }, [])

  const deleteLayer = useCallback((id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id))
    if (selectedId === id) setSelectedId(null)
  }, [selectedId])

  const selectLayer = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  const bringForward = useCallback((id: string) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id)
      if (idx < prev.length - 1) {
        const copy = [...prev]
        const [item] = copy.splice(idx, 1)
        copy.splice(idx + 1, 0, item)
        return copy
      }
      return prev
    })
  }, [])

  const sendBackward = useCallback((id: string) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id)
      if (idx > 0) {
        const copy = [...prev]
        const [item] = copy.splice(idx, 1)
        copy.splice(idx - 1, 0, item)
        return copy
      }
      return prev
    })
  }, [])

  const duplicateLayer = useCallback((id: string) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id)
      if (idx >= 0) {
        const copy = [...prev]
        const item = { ...copy[idx], id: uuidv4() }
        copy.splice(idx + 1, 0, item)
        return copy
      }
      return prev
    })
  }, [])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setLayers(history[newIndex].layers)
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setLayers(history[newIndex].layers)
    }
  }, [history, historyIndex])

  const saveDesign = useCallback((design: Design) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(design)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const clearLayers = useCallback(() => {
    setLayers([])
    setSelectedId(null)
  }, [])

  const value: MockupContextType = {
    layers,
    selectedId,
    history,
    historyIndex,
    scale,
    addLayer,
    updateLayer,
    deleteLayer,
    selectLayer,
    bringForward,
    sendBackward,
    duplicateLayer,
    setScale,
    undo,
    redo,
    saveDesign,
    clearLayers,
  }

  return <MockupContext.Provider value={value}>{children}</MockupContext.Provider>
}

export function useMockup() {
  const context = useContext(MockupContext)
  if (!context) {
    throw new Error('useMockup must be used within MockupProvider')
  }
  return context
}
