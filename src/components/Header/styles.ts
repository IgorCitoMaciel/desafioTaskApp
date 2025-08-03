import styled from 'styled-components/native';
import { colors } from '../../shared/colors';

export const Container = styled.View`
  background-color: ${colors.header};
  padding: 20px;
  padding-top: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 110px;
`;

export const Title = styled.Text`
  color: ${colors.text.light};
  font-size: 20px;
  font-weight: bold;
  font-family: 'Roboto-Regular';
`;

export const ConnectionStatus = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.overlay.light};
  padding: 4px 10px;
  border-radius: 20px;
  position: absolute;
  right: 20px;
  top: 60px;
`;

export const ConnectionStatusDot = styled.View<{ isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props =>
    props.isOnline ? colors.status.online : colors.status.offline};
  margin-right: 6px;
`;

export const ConnectionStatusText = styled.Text`
  color: ${colors.text.light};
  font-size: 12px;
  font-family: 'Roboto-Regular';
`;
