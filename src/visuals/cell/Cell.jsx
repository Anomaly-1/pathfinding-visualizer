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
    height = [30],  // Default responsive height
    width = [30],   // Default responsive width
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
        onMouseDown(row, col);
      }}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      width={width}
      height={height}
      border="1px solid black"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {isStart && (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      )}
      {isFinish && (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
        </svg>
      )}
    </Box>
  );
});

export default Cell;