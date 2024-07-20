import React from 'react';
import { Box } from '@chakra-ui/react';
import './Cell.css';

const Cell = React.memo((props) => {
  const {
    col,
    isFinish,
    isStart,
    isWall,
    isWeighted,
    isBomb,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    row,
    onWeightToggle,
    onBombToggle,
  } = props;

  const getExtraClassName = () => {
    if (isFinish) return 'node-finish';
    if (isStart) return 'node-start';
    if (isWall) return 'node-wall node-wall-animation';
    if (isWeighted) return 'node-weighted';
    if (isBomb) return 'node-bomb';
    return '';
  };

  return (
    <Box
      id={`node-${row}-${col}`}
      className={`node ${getExtraClassName()}`}
      onMouseDown={(e) => {
        if (e.shiftKey) {
          onWeightToggle(row, col);
        } else if (e.altKey) {
          onBombToggle(row, col);
        } else {
          onMouseDown(row, col);
        }
      }}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      width="30px"
      height="30px"
      border="1px solid black"
    >
      {/* INSIDE A CELL */}
    </Box>
  );
});

export default Cell;
