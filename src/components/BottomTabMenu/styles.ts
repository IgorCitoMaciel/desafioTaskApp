import { Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../shared/colors';

interface IconContainerProps {
  isFocused: boolean;
}

interface TabItemProps {
  isFocused: boolean;
}

export const TabContainer = styled.View`
  flex-direction: row;
  background-color: white;
  padding-top: 8px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-top-width: 1px;
  border-top-color: ${colors.border};

  ${Platform.select({
    ios: `
      shadow-color: #DDDDDD;
      shadow-offset: 0px 0px;
      shadow-opacity: 1;
      shadow-radius: 5px;
    `,
    android: `
      elevation: 8;
    `,
  })}
`;

export const TabItem = styled(TouchableOpacity)<TabItemProps>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
  padding-bottom: 8px;

  ${props =>
    props.isFocused &&
    `
    transform: translateY(-8px);
  `}
`;

export const IconContainer = styled.View<IconContainerProps>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  background-color: transparent;

  ${props =>
    props.isFocused &&
    `
    background-color: ${colors.primary};
    border-width: 3px;
    border-color: white;
    transform: scale(1.15);
  `}
`;
