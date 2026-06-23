import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { Stage, Layer, Image as KImage, Transformer, Rect, Text, Group, Path } from 'react-konva'
import useImage from 'use-image'
import { useMockup } from '../context/MockupContext'

const TRANSFORMER_COLOR = '#FF5722'
const transformerProps = {
  anchorSize: 12,
  anchorStroke: '#000',
  anchorFill: TRANSFORMER_COLOR,
  borderStroke: TRANSFORMER_COLOR,
  borderStrokeWidth: 2,
  keepRatio: true,
  rotateEnabled: true,
  enabledAnchors: ['top-left', 'top-right', 'bottom-right', 'bottom-left'],
}

const createBoundBoxFunc = () => {
  return (oldBox, newBox) => {
    // Avoid scaling below 10px to prevent disappearing/flipping issues
    if (newBox.width < 10 || newBox.height < 10) {
      return oldBox
    }
    return newBox
  }
}

function ImageLayerNode({ node, isSelected, onSelect, onChange, printable }) {
  const [image] = useImage(node.src, 'anonymous')
  const shapeRef = useRef(null)
  const trRef = useRef(null)

  // Force render to populate shapeRef for Transformer on mount/load
  const [, forceUpdate] = useState({});
  useEffect(() => {
    forceUpdate({});
  }, [image]);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected, image])

  return (
    <React.Fragment>
      <KImage
        image={image}
        x={node.x}
        y={node.y}
        width={node.width || 200}
        height={node.height || 200}
        rotation={node.rotation}
        scaleX={node.scaleX}
        scaleY={node.scaleY}
        opacity={node.opacity ?? 1}
        draggable
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTouchStart={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        dragBoundFunc={(pos) => {
          const stage = shapeRef.current?.getStage();
          if (!stage) return pos;

          // Convert absolute screen coordinates to local stage coordinates
          const transform = stage.getAbsoluteTransform().copy().invert();
          const localPos = transform.point(pos);

          const width = (node.width || 200) * (node.scaleX || 1);
          const height = (node.height || 200) * (node.scaleY || 1);

          // Allow dragging anywhere within the stage canvas limits
          const sWidth = stage.width() / stage.scaleX();
          const sHeight = stage.height() / stage.scaleY();

          const clampedLocalX = Math.max(0, Math.min(localPos.x, sWidth - width));
          const clampedLocalY = Math.max(0, Math.min(localPos.y, sHeight - height));

          // Convert local coordinates back to absolute coordinates for Konva
          return stage.getAbsoluteTransform().point({ x: clampedLocalX, y: clampedLocalY });
        }}
        onDragEnd={(e) => {
          onChange({
            ...node,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={(e) => {
          const shape = shapeRef.current;
          onChange({
            ...node,
            x: shape.x(),
            y: shape.y(),
            rotation: shape.rotation(),
            scaleX: shape.scaleX(),
            scaleY: shape.scaleY(),
          })
        }}
        ref={shapeRef}
      />
      {isSelected && shapeRef.current && (
        <Transformer
          ref={trRef}
          nodes={[shapeRef.current]}
          {...transformerProps}
          boundBoxFunc={createBoundBoxFunc()}
        />
      )}
    </React.Fragment>
  )
}

const MockupCanvas = forwardRef(({ mockup, activeSide = 'front' }, ref) => {
  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const fileInputRef = useRef(null)

  const previewImageSrc = activeSide === 'front' ? (mockup.previewFront || mockup.preview) : (mockup.previewBack || mockup.preview)
  const [backgroundImage] = useImage(previewImageSrc, 'anonymous')

  const { layers, selectedId, selectLayer, updateLayer, deleteLayer, scale, addLayer } = useMockup()
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const stageWidth = mockup.printable.width + mockup.printable.x * 2
  const stageHeight = mockup.printable.height + mockup.printable.y * 2

  // Filter layers for the current active side
  const sideLayers = layers.filter(layer => layer.side === activeSide)

  useImperativeHandle(ref, () => ({
    exportImage: () => {
      if (!stageRef.current) return null;

      // Find and hide transformers
      const transformers = stageRef.current.find('Transformer');
      transformers.forEach(tr => tr.hide());

      // Find and hide boundary
      const boundary = stageRef.current.findOne('.printableBoundary');
      if (boundary) boundary.hide();

      // Find and hide upload placeholder Group
      const uploadGroup = stageRef.current.findOne('.uploadGroup');
      if (uploadGroup) uploadGroup.hide();

      // Redraw stage to reflect hidden elements
      stageRef.current.draw();

      // Get the data URL (Base64 PNG)
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });

      // Restore the elements' visibility
      transformers.forEach(tr => tr.show());
      if (boundary) boundary.show();
      if (uploadGroup) uploadGroup.show();

      // Redraw stage to restore UI state
      stageRef.current.draw();

      return dataUrl;
    }
  }));

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const checkDeselect = (e) => {
    if (e.target === e.target.getStage() || e.target.name() === 'background') {
      selectLayer(null)
    }
  }

  const processFile = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new window.Image()
      img.src = reader.result
      img.onload = () => {
        const aspectRatio = img.width / img.height
        const targetHeight = 200 // Base height
        const targetWidth = targetHeight * aspectRatio // Responsive width

        const newLayerId = addLayer({
          type: 'image',
          side: activeSide,
          src: reader.result,
          // Center inside printable area
          x: mockup.printable.x + (mockup.printable.width / 2) - (targetWidth / 2),
          y: mockup.printable.y + (mockup.printable.height / 2) - (targetHeight / 2),
          width: targetWidth,
          height: targetHeight,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        })
        selectLayer(newLayerId)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCanvasUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    processFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const padding = 40;
  const availableWidth = Math.max(1, containerSize.width - padding * 2);
  const availableHeight = Math.max(1, containerSize.height - padding * 2);
  const fitScale = containerSize.width === 0 ? 1 : Math.min(availableWidth / stageWidth, availableHeight / stageHeight);
  const finalScale = fitScale * scale;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full flex justify-center items-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        backgroundColor: '#F5F2EB'
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCanvasUpload}
        accept="image/*"
        className="hidden"
      />

      {containerSize.width > 0 && (
        <Stage
          width={stageWidth * finalScale}
          height={stageHeight * finalScale}
          scaleX={finalScale}
          scaleY={finalScale}
          ref={stageRef}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            <KImage
              image={backgroundImage}
              x={0}
              y={0}
              width={stageWidth}
              height={stageHeight}
              name="background"
            />

            <Rect
              x={mockup.printable.x}
              y={mockup.printable.y}
              width={mockup.printable.width}
              height={mockup.printable.height}
              stroke="#FF5722"
              strokeWidth={2}
              dash={[8, 8]}
              listening={false}
              name="printableBoundary"
            />

            {sideLayers.length === 0 && (
              <Group
                x={mockup.printable.x}
                y={mockup.printable.y}
                onMouseEnter={(e) => { e.target.getStage().container().style.cursor = 'pointer' }}
                onMouseLeave={(e) => { e.target.getStage().container().style.cursor = 'default' }}
                onClick={() => fileInputRef.current?.click()}
                onTap={() => fileInputRef.current?.click()}
                name="uploadGroup"
              >
                <Rect
                  x={0} y={0}
                  width={mockup.printable.width}
                  height={mockup.printable.height}
                  fill="rgba(0,0,0,0)"
                />

                <Group y={mockup.printable.height / 2 - 30} listening={false}>
                  <Path
                    x={mockup.printable.width / 2 - 15} y={-45}
                    data="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" fill="#FF5722" scale={{ x: 1.5, y: 1.5 }}
                  />
                  <Text
                    y={0} width={mockup.printable.width}
                    text="DRAG IMAGE HERE" align="center" fill="#FF5722" fontSize={16} fontFamily="monospace" fontStyle="bold" lineHeight={1.5}
                  />
                  <Path
                    x={mockup.printable.width / 2 - 15} y={65}
                    data="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" fill="#FF5722" scale={{ x: 1.5, y: -1.5 }}
                  />
                </Group>
              </Group>
            )}
          </Layer>

          <Layer>
            {sideLayers.map((layer) => {
              if (layer.type === 'image') {
                return (
                  <ImageLayerNode
                    key={layer.id}
                    node={layer}
                    isSelected={selectedId === layer.id}
                    onSelect={() => selectLayer(layer.id)}
                    onChange={(updated) => updateLayer(layer.id, updated)}
                    printable={mockup.printable}
                  />
                )
              }
              return null
            })}
          </Layer>
        </Stage>
      )}
    </div>
  )
})

export default MockupCanvas