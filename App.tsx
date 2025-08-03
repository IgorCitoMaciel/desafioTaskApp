import React from 'react';
import { Routes } from './src/routes';
import { NetworkProvider } from './src/contexts/NetworkContext';

export default function App() {
  return (
    <NetworkProvider>
      <Routes />
    </NetworkProvider>
  );
}
