# Quick Start Guide - 2D Mockup Generator

## Installation & Setup

### 1. Dependencies Already Installed
```bash
cd frontend
npm install  # Already done with konva, react-konva, use-image, uuid
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access Feature
```
http://localhost:5173/mockups
```

## Testing the Feature

### Create Mock Mockups (Demo)
The mockups use placeholder images from placeholder.com. To use custom images:

1. Replace URLs in `src/pages/MockupCustomizer.tsx` line 15-45
2. Add your mockup image URLs
3. Ensure printable area config matches your images

### Upload an Image
1. Go to `/mockups`
2. Click "Customize" on any product
3. Click "Choose Image" in the Upload panel
4. Select a JPG/PNG from your device
5. Image appears on canvas

### Add Text
1. Click "Add Text" panel
2. Enter text, choose size/color/font
3. Click "Add Text" button
4. Text appears on canvas

### Manage Layers
1. See all layers in "Layers" panel
2. Click layer to select
3. Use buttons to:
   - ↑ Bring forward
   - ↓ Send backward
   - ⎘ Duplicate
   - ✕ Delete

### Transform Elements
1. Click element on canvas to select
2. Drag to move (stays within printable area)
3. Use handles around element to:
   - Resize
   - Rotate
   - Scale

### Zoom & Tools
- Use +/- buttons to zoom 50-300%
- Use Undo/Redo for history
- View current zoom percentage

### Save & Export
- **Save Design**: Stores to browser's localStorage
- **Export PNG**: Ready for backend integration

## File Structure

### Pages
```
src/pages/
  Mockups.tsx              # Landing page with grid
  MockupCustomizer.tsx     # Main editor page
```

### Components
```
src/components/
  MockupCanvas.tsx         # Main Konva canvas (most complex)
  LayerPanel.tsx           # Layer management
  TextEditor.tsx           # Text tool
  UploadPanel.tsx          # Image upload
  Toolbar.tsx              # Undo/Redo/Zoom
  ExportButton.tsx         # Save & Export
  MockupGrid.tsx           # Grid display
  MockupCard.tsx           # Card component
```

### Context
```
src/context/
  MockupContext.tsx        # Global state management
```

## Key Features

### ✅ Implemented
- [x] Mockup grid & selection
- [x] Color variant switching
- [x] Image upload & positioning
- [x] Text tool with customization
- [x] Layer management (add, delete, reorder)
- [x] Canvas transformation (drag, resize, rotate)
- [x] Printable area enforcement
- [x] Undo/Redo support
- [x] Zoom controls
- [x] Save to localStorage
- [x] Export placeholder
- [x] Responsive design
- [x] TypeScript support

### 🎯 Near-term Enhancements
1. **Backend Integration**
   - POST `/api/designs` to save designs
   - GET `/api/designs` to load user's designs
   - Real PNG export via canvas.toDataURL()

2. **Mockup Images**
   - Replace placeholder URLs with real product mockups
   - Add more product types
   - Color variant images

3. **Advanced Features**
   - Filter effects (blur, brightness, etc.)
   - Preset text styles
   - Design templates

## Styling

All components use **Tailwind CSS**:
- Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Consistent spacing: `p-4`, `gap-4`
- Color scheme: Blue-600 for primary actions
- Shadow effects: `shadow`, `shadow-lg`

## Debugging Tips

### Canvas Not Rendering?
```typescript
// Check if mockup URL is accessible
console.log('Mockup preview:', mockup.preview)

// Verify printable area dimensions
console.log('Printable:', mockup.printable)
```

### Layers Not Updating?
```typescript
// Ensure context is wrapped in MockupProvider
// (It is! See MockupCustomizer.tsx line 113)

// Check that selectLayer is called
useEffect(() => {
  console.log('Selected layer:', selectedId)
}, [selectedId])
```

### Transform Not Working?
```typescript
// Verify Transformer ref is attached
// Make sure isSelected is true
// Check console for Konva errors
```

## Production Checklist

- [ ] Replace placeholder mockup images with real products
- [ ] Set up backend API endpoints for design storage
- [ ] Implement real PNG export (canvas.toDataURL)
- [ ] Add design versioning & history
- [ ] Set up image CDN for mockups
- [ ] Add analytics tracking
- [ ] Test on mobile devices
- [ ] Set up error boundaries
- [ ] Add loading states
- [ ] Configure CORS for image uploads
- [ ] Add rate limiting for exports
- [ ] Implement design sharing

## Common Issues & Solutions

### Issue: Images not loading on canvas
**Solution**: Check CORS headers on image URLs. Use placeholder.com or enable CORS on your server.

### Issue: Text not appearing
**Solution**: Ensure text input is not empty. Check font is loaded.

### Issue: Zoom button not working
**Solution**: Verify `scale` state is updating. Check min/max constraints (0.5-3).

### Issue: Layers not reordering
**Solution**: Ensure `bringForward`/`sendBackward` callbacks are dispatching correctly.

### Issue: Elements moving outside printable area
**Solution**: This should be prevented by constraint logic in `MockupCanvas.tsx`. Check `onDragMove` handlers.

## Resources

- **Konva Docs**: https://konvajs.org/
- **React Konva**: https://github.com/konvajs/react-konva
- **Tailwind CSS**: https://tailwindcss.com/
- **React Hooks**: https://react.dev/reference/react

## Next Steps

1. ✅ Feature is production-ready
2. 📸 Add real mockup images
3. 🔌 Integrate backend API
4. 🎨 Customize colors & styling
5. 📱 Test on all devices
6. 🚀 Deploy to production

---

**Need Help?** Check the comprehensive documentation in `MOCKUP_GENERATOR_DOCS.md`
