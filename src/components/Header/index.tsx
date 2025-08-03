import React, { useEffect } from 'react';
import { useNetwork } from '../../contexts/NetworkContext';
import {
  Container,
  Title,
  ConnectionStatus,
  ConnectionStatusDot,
  ConnectionStatusText,
} from './styles';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { isOnline } = useNetwork();

  useEffect(() => {
    console.log('Header: Estado da conexão atualizado:', isOnline);
  }, [isOnline]);

  return (
    <Container>
      <Title>{title}</Title>
      <ConnectionStatus>
        <ConnectionStatusDot isOnline={isOnline} />
        <ConnectionStatusText>
          {isOnline ? 'Online' : 'Offline'}
        </ConnectionStatusText>
      </ConnectionStatus>
    </Container>
  );
}
