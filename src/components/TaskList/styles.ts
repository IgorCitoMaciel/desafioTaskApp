import styled from 'styled-components/native';
import { FlatList, Platform } from 'react-native';
import { Task } from '../../services/taskService';
import { colors } from '../../shared/colors';

type FlatListProps = {
  data: Task[];
};

export const Container = styled.View`
  flex: 1;
`;

export const List = styled(FlatList)<FlatListProps>`
  padding: 10px;
` as unknown as typeof FlatList;

export const TaskItem = styled.View`
  background-color: ${colors.background.card};
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 15px;
  border-width: 1px;
  border-color: ${colors.border.card};
  border-left-width: 5px;
  border-left-color: ${colors.border.task};

  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadow.light};
      shadow-offset: 0px 5px;
      shadow-opacity: 0.2;
      shadow-radius: 15px;
    `,
    android: `
      elevation: 8;
    `,
  })}
`;

export const TaskTitle = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text.dark};
  margin-bottom: 8px;
`;

export const TaskDescription = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 14px;
  color: ${colors.text.secondary};
  margin-bottom: 16px;
`;

export const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 16px;
`;

export const ActionButton = styled.TouchableOpacity``;

export const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ButtonText = styled.Text<{ danger?: boolean }>`
  font-family: 'Roboto-Regular';
  color: ${({ danger }) => (danger ? colors.danger : colors.action)};
  font-size: 14px;
  font-weight: 500;
`;
