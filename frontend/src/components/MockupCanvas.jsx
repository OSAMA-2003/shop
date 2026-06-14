import React, { useEffect, useRef } from 'react'
import { Stage, Layer, Image as KImage, Transformer, Rect } from 'react-konva'
import useImage from 'use-image'
import { useMockup } from '../context/MockupContext'

// Matches the exact style of your screenshot
const TRANSFORMER_COLOR = '#5A54F9'
const transformerProps = {
  anchorSize: 12,
  anchorCornerRadius: 6, // Circular handles
  anchorStroke: TRANSFORMER_COLOR,
  anchorFill: TRANSFORMER_COLOR,
  borderStroke: TRANSFORMER_COLOR,
  borderStrokeWidth: 2,
  keepRatio: true,
  enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'], // Only corner handles for clean UI
}

// Blocks resizing outside the printable box
const createBoundBoxFunc = (printable) => {
  return (oldBox, newBox) => {
    if (
      newBox.x < printable.x ||
      newBox.y < printable.y ||
      newBox.x + newBox.width > printable.x + printable.width ||
      newBox.y + newBox.height > printable.y + printable.height
    ) {
      return oldBox // Reject the resize
    }
    return newBox // Accept the resize
  }
}

// The interactive image component
function ImageLayerNode({ node, isSelected, onSelect, onChange, printable }) {
  const [image] = useImage(node.src)
  const shapeRef = useRef(null)
  const trRef = useRef(null)

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <KImage
        image={image}
        x={node.x}
        y={node.y}
        width={node.width || 200}
        height={node.height || 200}
        rotation={node.rotation}
        scaleX={node.scaleX}
        scaleY={node.scaleY}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragMove={(e) => {
          // Block dragging outside the box
          const target = e.target;
          const width = target.width() * target.scaleX();
          const height = target.height() * target.scaleY();
          
          const x = Math.max(printable.x, Math.min(printable.x + printable.width - width, target.x()));
          const y = Math.max(printable.y, Math.min(printable.y + printable.height - height, target.y()));
          
          target.x(x);
          target.y(y);
        }}
        onDragEnd={(e) => {
          onChange({
            ...node,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale and apply it purely to width/height to prevent distortion bugs over time
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...node,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            scaleX: 1,
            scaleY: 1,
          })
        }}
        ref={shapeRef}
      />
      {isSelected && (
        <Transformer 
          ref={trRef} 
          {...transformerProps} 
          boundBoxFunc={createBoundBoxFunc(printable)}
        />
      )}
    </>
  )
}

export default function MockupCanvas({ mockup }) {
  const stageRef = useRef(null)
  const [backgroundImage] = useImage(mockup.preview)
  const { layers, selectedId, selectLayer, updateLayer, scale } = useMockup()

  const stageWidth = mockup.printable.width + mockup.printable.x * 2
  const stageHeight = mockup.printable.height + mockup.printable.y * 2

  const checkDeselect = (e) => {
    // Clicked empty stage or background image
    if (e.target === e.target.getStage() || e.target.name() === 'background') {
      selectLayer(null)
    }
  }

  return (
    <div className="w-full flex justify-center items-center py-8">
      <Stage 
        width={stageWidth} 
        height={stageHeight} 
        scaleX={scale} 
        scaleY={scale} 
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
          {/* Subtle outline showing the user where they are allowed to put the design */}
          <Rect
            x={mockup.printable.x}
            y={mockup.printable.y}
            width={mockup.printable.width}
            height={mockup.printable.height}
            stroke="#5A54F9"
            strokeWidth={1}
            dash={[5, 5]}
            opacity={0.3}
            listening={false} 
          />
        </Layer>

        <Layer>
          {layers.map((layer) => {
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
    </div>
  )
}