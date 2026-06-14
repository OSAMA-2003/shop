// Backend Integration Example
// This file shows how to connect the mockup generator to a backend API

// ============================================================================
// 1. SAVE DESIGN - Send to Backend
// ============================================================================

// In src/components/ExportButton.tsx, replace the save function:

/*
async function handleSave() {
  const design = {
    mockupId: mockup.id,
    side: 'front',
    color: color,
    layers: layers,
    createdAt: new Date().toISOString(),
  }

  try {
    const response = await axios.post('/api/designs', design, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add auth token
        'Content-Type': 'application/json'
      }
    })

    console.log('Design saved:', response.data)
    alert('Design saved successfully! ID: ' + response.data.id)
  } catch (error) {
    console.error('Error saving design:', error)
    alert('Failed to save design')
  }
}
*/

// ============================================================================
// 2. LOAD USER DESIGNS - Fetch from Backend
// ============================================================================

// New page: src/pages/MyDesigns.tsx

/*
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function MyDesigns() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDesigns()
  }, [])

  async function fetchDesigns() {
    try {
      const response = await axios.get('/api/designs/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setDesigns(response.data)
    } catch (error) {
      console.error('Error fetching designs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Designs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map(design => (
          <div key={design.id} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="font-semibold mb-2">{design.mockupId}</h3>
            <p className="text-sm text-gray-600">
              {new Date(design.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm mb-4">Layers: {design.layers.length}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => loadDesign(design.id)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

async function loadDesign(designId) {
  const response = await axios.get(`/api/designs/${designId}`)
  // Navigate to customizer with loaded design
  // Use context to load layers
}
*/

// ============================================================================
// 3. EXPORT PNG - Backend Processing
// ============================================================================

// In src/components/ExportButton.tsx:

/*
async function handleExport() {
  if (layers.length === 0) {
    alert('No designs to export')
    return
  }

  try {
    const response = await axios.post('/api/export/png', {
      mockupId: mockup.id,
      layers: layers,
      resolution: 3, // 3x high resolution
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      responseType: 'blob'
    })

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `design-${Date.now()}.png`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  } catch (error) {
    console.error('Error exporting design:', error)
    alert('Failed to export design')
  }
}
*/

// ============================================================================
// 4. BACKEND API ENDPOINTS (Node.js/Express Example)
// ============================================================================

/*
// POST /api/designs - Save design
router.post('/designs', authenticateToken, async (req, res) => {
  try {
    const { mockupId, side, color, layers, createdAt } = req.body
    const userId = req.user.id

    const design = new Design({
      userId,
      mockupId,
      side,
      color,
      layers,
      createdAt
    })

    await design.save()
    res.json({ id: design._id, message: 'Design saved' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET /api/designs/user - Get user's designs
router.get('/designs/user', authenticateToken, async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
    res.json(designs)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET /api/designs/:id - Get specific design
router.get('/designs/:id', authenticateToken, async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      userId: req.user.id
    })
    if (!design) return res.status(404).json({ error: 'Design not found' })
    res.json(design)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE /api/designs/:id - Delete design
router.delete('/designs/:id', authenticateToken, async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    })
    if (!design) return res.status(404).json({ error: 'Design not found' })
    res.json({ message: 'Design deleted' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST /api/export/png - Export design as PNG
router.post('/export/png', authenticateToken, async (req, res) => {
  try {
    const { mockupId, layers, resolution } = req.body

    // Here you would use a library like canvas or sharp to:
    // 1. Load the mockup image
    // 2. Draw layers on top
    // 3. Export as PNG

    // Example with canvas:
    const canvas = new Canvas(800, 600)
    const ctx = canvas.getContext('2d')

    // Draw background mockup
    const mockupImage = await loadImage(`public/mockups/${mockupId}.png`)
    ctx.drawImage(mockupImage, 0, 0)

    // Draw layers
    for (const layer of layers) {
      if (layer.type === 'image') {
        const img = await loadImage(layer.src)
        ctx.save()
        ctx.translate(layer.x, layer.y)
        ctx.rotate(layer.rotation)
        ctx.scale(layer.scaleX, layer.scaleY)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)
        ctx.restore()
      } else if (layer.type === 'text') {
        ctx.font = `${layer.fontSize}px ${layer.fontFamily}`
        ctx.fillStyle = layer.fill
        ctx.save()
        ctx.translate(layer.x, layer.y)
        ctx.rotate(layer.rotation)
        ctx.fillText(layer.text, 0, 0)
        ctx.restore()
      }
    }

    // Convert to PNG and send
    const png = canvas.toBuffer('image/png')
    res.set('Content-Type', 'image/png')
    res.send(png)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
*/

// ============================================================================
// 5. DATABASE SCHEMA (MongoDB Example)
// ============================================================================

/*
const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mockupId: {
    type: String,
    required: true
  },
  side: {
    type: String,
    enum: ['front', 'back'],
    default: 'front'
  },
  color: {
    type: String,
    required: true
  },
  layers: [{
    id: String,
    type: {
      type: String,
      enum: ['image', 'text']
    },
    src: String,
    text: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    rotation: Number,
    scaleX: Number,
    scaleY: Number,
    fontSize: Number,
    fill: String,
    fontFamily: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Optional: thumbnail of design
  thumbnail: String,
  // Optional: design metadata
  title: String,
  description: String,
  isPublic: Boolean,
  tags: [String]
})

const Design = mongoose.model('Design', designSchema)
*/

// ============================================================================
// 6. ENVIRONMENT VARIABLES (.env)
// ============================================================================

/*
VITE_API_URL=http://localhost:5000
VITE_API_BASE_PATH=/api

# Or for production:
VITE_API_URL=https://api.example.com
*/

// ============================================================================
// 7. AXIOS SETUP (src/utils/api.ts)
// ============================================================================

/*
import axios, { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
*/

// ============================================================================
// 8. UPDATE ExportButton.tsx with API Integration
// ============================================================================

/*
import React, { useRef } from 'react'
import { useMockup } from '../context/MockupContext'
import { Download, Save } from 'lucide-react'
import api from '../utils/api'

export default function ExportButton({ mockup }: { mockup: any }) {
  const { layers } = useMockup()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleExport() {
    setLoading(true)
    try {
      const response = await api.post('/export/png', {
        mockupId: mockup.id,
        layers,
        resolution: 3
      }, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `design-${Date.now()}.png`
      link.click()
    } catch (err) {
      setError('Export failed')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setLoading(true)
    try {
      const design = {
        mockupId: mockup.id,
        side: 'front',
        color: 'white',
        layers,
        createdAt: new Date().toISOString()
      }

      const response = await api.post('/designs', design)
      alert('Design saved! ID: ' + response.data.id)
    } catch (err) {
      setError('Save failed')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-3">Export</h3>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <div className="space-y-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} /> {loading ? 'Saving...' : 'Save Design'}
        </button>
        <button
          onClick={handleExport}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          <Download size={18} /> {loading ? 'Exporting...' : 'Export PNG'}
        </button>
      </div>
    </div>
  )
}
*/

// ============================================================================
// SUMMARY
// ============================================================================

/*
To integrate with backend:

1. Create backend endpoints:
   - POST /api/designs
   - GET /api/designs/user
   - GET /api/designs/:id
   - POST /api/export/png

2. Update ExportButton.tsx to use api.post() instead of localStorage

3. Create MyDesigns.tsx page to show saved designs

4. Add authentication header to all requests

5. Implement image export on backend using Canvas or Sharp library

6. Set environment variables in .env

7. Test all CRUD operations

The mockup generator is NOW ready to connect to your backend!
*/
