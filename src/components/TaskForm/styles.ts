import styled from 'styled-components/native';
import { colors } from '../../shared/colors';

export const Container = styled.View`
  padding: 20px;
`;

export const Input = styled.TextInput`
  font-family: 'Roboto-Regular';
  background-color: ${colors.background.input};
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  border-width: 1px;
  border-color: #e0e0e0;
`;

export const SubmitButton = styled.TouchableOpacity`
  background-color: #6352a7;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-family: 'Roboto-Regular';
  color: ${colors.text.light};
  font-size: 16px;
  font-weight: bold;
`;
