import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #667eea;
`;

export const Content = styled.View`
  flex: 1;
  padding: 20px;
`;

export const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const EmptyStateText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 24px;
`;
