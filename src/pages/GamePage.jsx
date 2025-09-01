import React from 'react';
import FlappyPlaneGame from '../components/FlappyPlaneGame';

const GamePage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#111' }}>
    <FlappyPlaneGame />
  </div>
);

export default GamePage;
