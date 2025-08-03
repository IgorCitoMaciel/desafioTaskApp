import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Routes } from './routes';
import { NetworkProvider } from './contexts/NetworkContext';

export function App() {
  return (
    <NetworkProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </NetworkProvider>
  );
}
