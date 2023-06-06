import React from 'react';
import { useDrag } from 'react-dnd';

const Box = ({ id, left, top, hideSourceOnDrag, gridGap, isConnected }) => {
  const style = {
    position: 'absolute',
    border: '1px dashed gray',
    backgroundColor: isConnected ? 'lightgreen' : 'white',  // change color if connected
    padding: '0.5rem 1rem',
    cursor: 'move',
    width: '50px',
    height: '50px',
    margin: `${gridGap / 2}px`,  // add a margin
    left,
    top
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    item: { id, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }

  return (
    <div ref={drag} style={style}>
      Drag me
    </div>
  );
};

export default Box;
