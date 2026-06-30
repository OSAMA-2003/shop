import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";

import { fabric } from "fabric";
import { useMockup } from "../context/MockupContext";

const VIRTUAL_WIDTH = 600;
const VIRTUAL_HEIGHT = 600;

const MockupCanvas = forwardRef(
  ({ mockup, color, canvasSide }, ref) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const fabricCanvas = useRef(null);

    const {
      layers,
      selectedId,
      selectLayer,
      updateLayer,
      scale,
    } = useMockup();

    const [dimensions, setDimensions] = useState({
      width: 600,
      height: 600,
    });

    // Keep stable references of context state/callbacks to prevent stale event handlers
    const selectLayerRef = useRef(selectLayer);
    const updateLayerRef = useRef(updateLayer);
    const layersRef = useRef(layers);
    const selectedIdRef = useRef(selectedId);
    const canvasSideRef = useRef(canvasSide);

    useEffect(() => {
      selectLayerRef.current = selectLayer;
      updateLayerRef.current = updateLayer;
      layersRef.current = layers;
      selectedIdRef.current = selectedId;
      canvasSideRef.current = canvasSide;
    }, [selectLayer, updateLayer, layers, selectedId, canvasSide]);

    // ==========================================
    // Responsive container Resize Observer
    // ==========================================
    useEffect(() => {
      if (!containerRef.current) return;

      const resizeObserver = new ResizeObserver((entries) => {
        if (!entries || entries.length === 0) return;
        const rect = entries[0].contentRect;

        // Keep bounds reasonable
        setDimensions({
          width: Math.max(100, rect.width),
          height: Math.max(100, rect.height),
        });
      });

      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }, []);

    // ==========================================
    // Initialize Fabric Canvas
    // ==========================================
    useEffect(() => {
      // Style object controls to match the professional neo-brutalist theme
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = "#FF5722";
      fabric.Object.prototype.cornerStrokeColor = "#000000";
      fabric.Object.prototype.cornerSize = 10;
      fabric.Object.prototype.cornerStyle = "circle";
      fabric.Object.prototype.borderColor = "#FF5722";
      fabric.Object.prototype.borderScaleFactor = 2.5;
      fabric.Object.prototype.borderDashArray = [4, 4];

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: dimensions.width,
        height: dimensions.height,
        preserveObjectStacking: true,
        selection: true,
      });

      fabricCanvas.current = canvas;

      // Selection Handlers (using refs to prevent stale closure captures)
      canvas.on("selection:cleared", () => {
        selectLayerRef.current(null);
      });

      const handleSelection = (e) => {
        const selectedObj = e.selected?.[0];
        if (selectedObj && selectedObj.layerId) {
          selectLayerRef.current(selectedObj.layerId);
        }
      };

      canvas.on("selection:created", handleSelection);
      canvas.on("selection:updated", handleSelection);

      // Object manipulation: sync position, rotation, and scaling to context
      canvas.on("object:moving", (e) => {
        const obj = e.target;
        if (obj && obj.layerId) {
          updateLayerRef.current(obj.layerId, {
            x: obj.left,
            y: obj.top,
          });
        }
      });

      canvas.on("object:scaling", (e) => {
        const obj = e.target;
        if (obj && obj.layerId) {
          updateLayerRef.current(obj.layerId, {
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
          });
        }
      });

      canvas.on("object:rotating", (e) => {
        const obj = e.target;
        if (obj && obj.layerId) {
          updateLayerRef.current(obj.layerId, {
            rotation: obj.angle,
          });
        }
      });

      canvas.on("object:modified", (e) => {
        const obj = e.target;
        if (obj && obj.layerId) {
          updateLayerRef.current(obj.layerId, {
            x: obj.left,
            y: obj.top,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            rotation: obj.angle,
          });
        }
      });

      return () => {
        canvas.dispose();
        fabricCanvas.current = null;
      };
    }, []);

    // ==========================================
    // Handle Responsive Viewport fitting & Zoom
    // ==========================================
    useEffect(() => {
      if (!fabricCanvas.current) return;
      const canvas = fabricCanvas.current;

      canvas.setWidth(dimensions.width);
      canvas.setHeight(dimensions.height);

      // Calculate fitting zoom factor
      const fitScale = Math.min(
        dimensions.width / VIRTUAL_WIDTH,
        dimensions.height / VIRTUAL_HEIGHT
      );

      const totalZoom = fitScale * (scale || 1);
      canvas.setZoom(totalZoom);

      // Center the virtual square viewport in physical canvas space
      const viewportWidth = VIRTUAL_WIDTH * totalZoom;
      const viewportHeight = VIRTUAL_HEIGHT * totalZoom;
      const offsetX = (dimensions.width - viewportWidth) / 2;
      const offsetY = (dimensions.height - viewportHeight) / 2;

      canvas.viewportTransform = [totalZoom, 0, 0, totalZoom, offsetX, offsetY];
      canvas.renderAll();
    }, [dimensions, scale]);

    // ==========================================
    // Render/Sync Mockup Background Image
    // ==========================================
    const mockupImgSrc =
      canvasSide === "front"
        ? mockup?.previewFront || mockup?.preview
        : mockup?.previewBack || mockup?.preview;

    useEffect(() => {
      if (!fabricCanvas.current) return;
      const canvas = fabricCanvas.current;

      if (!mockupImgSrc) {
        const existingBg = canvas.getObjects().find((o) => o.isBackground);
        if (existingBg) {
          canvas.remove(existingBg);
          canvas.renderAll();
        }
        return;
      }

      fabric.Image.fromURL(
        mockupImgSrc,
        (img) => {
          if (!fabricCanvas.current || fabricCanvas.current !== canvas) return;

          // Remove any old background objects
          const oldBgObjects = canvas.getObjects().filter((o) => o.isBackground);
          oldBgObjects.forEach((o) => canvas.remove(o));

          // Calculate scale to fit within the virtual bounds
          const fitScale = Math.min(
            VIRTUAL_WIDTH / img.width,
            VIRTUAL_HEIGHT / img.height
          );

          img.set({
            originX: "center",
            originY: "center",
            left: VIRTUAL_WIDTH / 2,
            top: VIRTUAL_HEIGHT / 2,
            scaleX: fitScale,
            scaleY: fitScale,
            selectable: false,
            evented: false,
            isBackground: true,
          });

          canvas.add(img);
          canvas.sendToBack(img);
          canvas.renderAll();
        },
        {
          crossOrigin: "anonymous",
        }
      );
    }, [mockupImgSrc]);

    // ==========================================
    // Render/Sync Printable Area Guidelines
    // ==========================================
    useEffect(() => {
      if (!fabricCanvas.current) return;
      const canvas = fabricCanvas.current;

      // Remove existing guidelines
      const oldPrintables = canvas.getObjects().filter((o) => o.isPrintableArea);
      oldPrintables.forEach((o) => canvas.remove(o));

      const printable = mockup?.printable || {
        x: 150,
        y: 150,
        width: 300,
        height: 400,
      };

      const rect = new fabric.Rect({
        left: printable.x,
        top: printable.y,
        width: printable.width,
        height: printable.height,
        fill: "transparent",
        stroke: "#FF5722",
        strokeDashArray: [6, 4],
        selectable: false,
        evented: false,
        isPrintableArea: true,
      });

      const label = new fabric.Text("PRINTABLE AREA", {
        left: printable.x,
        top: printable.y - 15,
        fontSize: 10,
        fill: "#FF5722",
        selectable: false,
        evented: false,
        isPrintableArea: true,
      });

      canvas.add(rect);
      canvas.add(label);

      // Keep guidelines layered directly above background image
      const bg = canvas.getObjects().find((o) => o.isBackground);
      if (bg) {
        canvas.sendToBack(label);
        canvas.sendToBack(rect);
        canvas.sendToBack(bg);
      } else {
        canvas.sendToBack(label);
        canvas.sendToBack(rect);
      }

      canvas.renderAll();
    }, [mockup?.printable]);

    // ==========================================
    // Render/Sync Design Layers
    // ==========================================
    useEffect(() => {
      if (!fabricCanvas.current) return;
      const canvas = fabricCanvas.current;

      const sideLayers = layers.filter((layer) => layer.side === canvasSide);
      const currentFabricObjects = canvas.getObjects().filter((o) => o.layerId !== undefined);

      // 1. Remove deleted layers
      currentFabricObjects.forEach((obj) => {
        const stillExists = sideLayers.some((l) => l.id === obj.layerId);
        if (!stillExists) {
          canvas.remove(obj);
        }
      });

      // 2. Incremental Sync or Create
      sideLayers.forEach((layer) => {
        const existingObj = currentFabricObjects.find((o) => o.layerId === layer.id);

        if (existingObj) {
          // If the user is actively transforming this object, let local interaction drive coordinates
          const isInteracting = canvas._currentTransform && canvas.getActiveObject() === existingObj;

          if (!isInteracting) {
            existingObj.set({
              left: layer.x,
              top: layer.y,
              scaleX: layer.scaleX || 1,
              scaleY: layer.scaleY || 1,
              angle: layer.rotation || 0,
              opacity: layer.opacity ?? 1,
              globalCompositeOperation: " soft-light",
            });

            // Update specific properties
            if (layer.type === "text" && existingObj.type === "textbox") {
              existingObj.set({
                text: layer.text || "",
                fontSize: layer.fontSize || 24,
                fill: layer.fill || "#000",
                fontFamily: layer.fontFamily || "Arial",
              });
            }

            existingObj.setCoords();
          }
        } else {
          // Create new layer object
          if (layer.type === "image") {
            fabric.Image.fromURL(
              layer.src,
              (img) => {
                if (!fabricCanvas.current || fabricCanvas.current !== canvas) return;

                // Double check it wasn't deleted during async load
                const stillExists = layersRef.current.some(
                  (l) => l.id === layer.id && l.side === canvasSideRef.current
                );
                if (!stillExists) return;

                img.set({
                  left: layer.x,
                  top: layer.y,
                  scaleX: layer.scaleX || 1,
                  scaleY: layer.scaleY || 1,
                  angle: layer.rotation || 0,
                  opacity: layer.opacity ?? 1,
                  globalCompositeOperation: " soft-light",
                })

                img.layerId = layer.id

                canvas.add(img)

                // Select if it's the current selected layer
                if (selectedIdRef.current === layer.id) {
                  canvas.setActiveObject(img)
                }

                canvas.renderAll()
              },
              {
                crossOrigin: "anonymous",
              }
            );
          } else if (layer.type === "text") {
            const text = new fabric.Textbox(layer.text || "", {
              left: layer.x,
              top: layer.y,
              fontSize: layer.fontSize || 24,
              fill: layer.fill || "#000",
              fontFamily: layer.fontFamily || "Arial",
              angle: layer.rotation || 0,
              scaleX: layer.scaleX || 1,
              scaleY: layer.scaleY || 1,
              opacity: layer.opacity ?? 1,
              globalCompositeOperation: " soft-light",
            });

            text.layerId = layer.id;

            // Inline text editor event listener
            text.on("changed", () => {
              updateLayerRef.current(layer.id, {
                text: text.text,
              });
            });

            canvas.add(text);

            if (selectedIdRef.current === layer.id) {
              canvas.setActiveObject(text);
            }
          }
        }
      });

      canvas.renderAll();
    }, [layers, canvasSide]);

    // ==========================================
    // Sync Selected ID Changes from Context
    // ==========================================
    useEffect(() => {
      if (!fabricCanvas.current) return;
      const canvas = fabricCanvas.current;

      const activeObject = canvas.getActiveObject();
      if (selectedId) {
        const targetObj = canvas.getObjects().find((o) => o.layerId === selectedId);
        if (targetObj && activeObject !== targetObj) {
          canvas.setActiveObject(targetObj);
          canvas.renderAll();
        }
      } else {
        if (activeObject && activeObject.layerId) {
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    }, [selectedId]);

    // ==========================================
    // Professional PNG Image Export Handle
    // ==========================================
    useImperativeHandle(ref, () => ({
      exportImage: () => {
        if (!fabricCanvas.current) return null;
        const canvas = fabricCanvas.current;

        // Save original scaling state
        const currentZoom = canvas.getZoom();
        const currentTransform = [...canvas.viewportTransform];
        const currentWidth = canvas.getWidth();
        const currentHeight = canvas.getHeight();

        // 1. Reset canvas to virtual 600x600 size
        canvas.setWidth(VIRTUAL_WIDTH);
        canvas.setHeight(VIRTUAL_HEIGHT);
        canvas.setZoom(1);
        canvas.viewportTransform = [1, 0, 0, 1, 0, 0];

        // 2. Hide visual guidelines (dashed box & labels)
        const printableObjects = canvas.getObjects().filter((o) => o.isPrintableArea);
        printableObjects.forEach((o) => o.set({ visible: false }));

        // 3. Clear active selection borders/handles
        const activeObj = canvas.getActiveObject();
        canvas.discardActiveObject();
        canvas.renderAll();

        // 4. Export at 2x resolution (1200x1200px)
        const dataUrl = canvas.toDataURL({
          format: "png",
          multiplier: 2,
        });

        // 5. Restore guidelines and selection borders
        printableObjects.forEach((o) => o.set({ visible: true }));
        if (activeObj) {
          canvas.setActiveObject(activeObj);
        }

        // Restore canvas responsive sizing state
        canvas.setWidth(currentWidth);
        canvas.setHeight(currentHeight);
        canvas.setZoom(currentZoom);
        canvas.viewportTransform = currentTransform;
        canvas.renderAll();

        return dataUrl;
      },
    }));

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

MockupCanvas.displayName = "MockupCanvas";

export default MockupCanvas;