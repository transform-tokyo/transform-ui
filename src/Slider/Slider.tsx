import React, { useState, useEffect, useRef } from 'react';

interface SliderProps {
  value?: number;
  onDragEnd?: (v: number) => void;
  style?: React.CSSProperties;
}

//计算滑块百分比
function getPercent(x: number = 0, element: HTMLElement) {
  const targetClientRect = element.getBoundingClientRect();
  const fixPosX = x - targetClientRect.left;
  let res = (fixPosX * 100) / targetClientRect.width;
  if (res < 0) res = 0;
  if (res > 100) res = 100;
  return res;
}

const Slider: React.FC<SliderProps> = props => {
  const [percent, setPercent] = useState(props.value || 0);
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  function handleMouseDown(e: React.MouseEvent) {
    if (sliderRef.current === null) return;
    let newPercent = getPercent(e.pageX, sliderRef.current);
    setPercent(newPercent);
    setDragging(true);
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (sliderRef.current === null || !dragging) return;
    let newPercent = getPercent(e.pageX, sliderRef.current);
    setPercent(newPercent);
  };

  const handleMouseUP = () => {
    if (!dragging) return;
    props?.onDragEnd && props.onDragEnd(percent);
    setDragging(false);
  };

  useEffect(() => {
    // 拖动slider
    window.addEventListener('mouseup', handleMouseUP);
    window.addEventListener('mousemove', handleMouseMove as any);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUP);
    };
  }, [handleMouseMove, handleMouseUP]);

  useEffect(() => {
    props.value && !dragging && setPercent(props.value);
  }, [props.value]);

  return (
    <div
      className="slider"
      style={props.style}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUP}
      onDragEnd={handleMouseUP}
      ref={sliderRef}
    >
      <div className="slider-bg" />
      <div className="slider-track" style={{ width: percent + '%' }} />
      <div className="slider-handler" style={{ left: percent + '%' }} />
    </div>
  );
};

export default Slider;
