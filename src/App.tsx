import React, { useState, useEffect, useRef, useCallback } from 'react';
import { throttle, range } from 'lodash';

function App() {
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isDrag, setIsDrag] = useState(false);
  const xPosition = useRef(0);
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleDrag = (e: MouseEvent) => {
    if (isDrag && divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (x === xPosition.current) return;

      if (xPosition.current > x) {
        setImageIndex((prev) => {
          if (prev >= 31) {
            return 0;
          }
          return prev + 1;
        });
      } else {
        setImageIndex((prev) => {
          if (prev <= 0) {
            return 31;
          }
          return prev - 1;
        });
      }
      xPosition.current = x;
    }
  };

  const throttledDrag = throttle(handleDrag, 30, { leading: false, trailing: true });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (divRef.current) {
      const { left, right, top, bottom } = divRef.current.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (x >= left && x <= right && y >= top && y <= bottom) {
        xPosition.current = left - x;
        setIsDrag(true);
      }
    }
  }, []);

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDrag) setIsDrag(false);
    },
    [isDrag]
  );

  useEffect(() => {
    const arr = range(1, 33, 1);
    const newImages = arr.map((row) => {
      const url = `https://content.cylindo.com/api/v2/4404/products/ARCHIBALDCHAIR/frames/${row}/`;
      const newImage = new Image();
      newImage.src = url;
      return newImage;
    });
    setImages(newImages);
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', throttledDrag);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', throttledDrag);
    };
  }, [handleMouseUp, handleMouseDown, throttledDrag]);

  return (
    <>
      <h1 style={{ width: '300px', margin: '20px auto', textAlign: 'center' }}>Product Preview</h1>
      <div
        ref={divRef}
        style={{
          boxSizing: 'border-box',
          margin: '20px auto',
          width: '600px',
          height: '500px',
          border: '1px solid black',
          padding: '20px',
          cursor: '-webkit-grab',
          position: 'relative',
        }}
      >
        {images.map((img, idx) => {
          return (
            <img
              key={idx}
              style={{
                opacity: idx === imageIndex ? '1' : '0',
                display: 'block',
                position: 'absolute',
                top: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                margin: 0,
                padding: 0,
                maxWidth: '100%',
                maxHeight: '100%',
                pointerEvents: 'none',
                outline: 'none',
                userSelect: 'none',
              }}
              src={img.src}
              alt=""
              draggable={false}
            />
          );
        })}
      </div>
      <p style={{ margin: '20px', textAlign: 'center' }}>Click and drag to rotate the product</p>
    </>
  );
}

export default App;
