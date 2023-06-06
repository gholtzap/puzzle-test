import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import Box from './Box';

const style = {
  position: 'relative',
  width: 400, 
  height: 400, 
  border: '1px solid black'
};

const boxWidth = 50;  
const boxHeight = 50;  
const gridGap = 5;  

const BoxContainer = () => {
  const [boxes, setBoxes] = useState([
    { id: 'box1', left: 0, top: 0, isConnected: false },
    { id: 'box2', left: boxWidth + gridGap, top: 0, isConnected: false },
  ]);

  useEffect(() => {
    checkForConnections();
  }, [boxes]);

  const checkForConnections = () => {
    setBoxes(prevBoxes => 
      prevBoxes.map((box) => ({
        ...box,
        isConnected: isConnected(box, prevBoxes),
      }))
    );
  };

  const isConnected = (box, boxes) => {
    return boxes.some(otherBox =>
      otherBox.id !== box.id &&
      (otherBox.left === box.left + boxWidth + gridGap && otherBox.top === box.top ||
        otherBox.top === box.top + boxHeight + gridGap && otherBox.left === box.left)
    );
  };

  const [, drop] = useDrop(() => ({
    accept: 'box',
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      let left = Math.round(item.left + delta.x);
      let top = Math.round(item.top + delta.y);

      // Snap the box's position to the nearest grid cell
      left = Math.round(left / (boxWidth + gridGap)) * (boxWidth + gridGap);
      top = Math.round(top / (boxHeight + gridGap)) * (boxHeight + gridGap);

      // Don't let the box go outside of the container's boundaries
      const containerBounds = {
        left: 0,
        top: 0,
        right: style.width - boxWidth, 
        bottom: style.height - boxHeight,  
      }
      if (left < containerBounds.left) left = containerBounds.left;
      if (top < containerBounds.top) top = containerBounds.top;
      if (left > containerBounds.right) left = containerBounds.right;
      if (top > containerBounds.bottom) top = containerBounds.bottom;

      moveBox(item.id, left, top);
      return undefined;
    },
  }));

  const moveBox = (id, left, top) => {
    setBoxes(prevBoxes =>
      prevBoxes.map((box) =>
        box.id === id ? { ...box, left, top } : box
      )
    );
  };

  return (
    <div ref={drop} style={style}>
      {boxes.map((box) => (
        <Box key={box.id} id={box.id} left={box.left} top={box.top} gridGap={gridGap} isConnected={box.isConnected} />
      ))}
    </div>
  );
};

export default BoxContainer;
