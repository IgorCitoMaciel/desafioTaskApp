import React from 'react';
import { ListRenderItem } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Task } from '../../services/taskService';
import { colors } from '../../shared/colors';
import {
  Container,
  List,
  TaskItem,
  TaskTitle,
  TaskDescription,
  ActionButtons,
  ActionButton,
  ButtonText,
  ButtonContent,
} from './styles';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <TaskItem>
      <TaskTitle>{item.title}</TaskTitle>
      <TaskDescription>{item.description}</TaskDescription>
      <ActionButtons>
        {item.status === 'PENDING' ? (
          <ActionButton onPress={() => onToggleTask(item.id)}>
            <ButtonContent>
              <Icon name="check-circle" size={20} color={colors.action} />
              <ButtonText>Completar</ButtonText>
            </ButtonContent>
          </ActionButton>
        ) : (
          <ActionButton onPress={() => onToggleTask(item.id)}>
            <ButtonContent>
              <Icon name="undo" size={20} color={colors.action} />
              <ButtonText>Reverter</ButtonText>
            </ButtonContent>
          </ActionButton>
        )}
        <ActionButton onPress={() => onDeleteTask(item.id)}>
          <ButtonContent>
            <Icon name="delete" size={20} color={colors.danger} />
            <ButtonText danger>Excluir</ButtonText>
          </ButtonContent>
        </ActionButton>
      </ActionButtons>
    </TaskItem>
  );

  return (
    <Container>
      <List
        data={tasks}
        keyExtractor={(task: Task) => task.id}
        renderItem={renderItem}
      />
    </Container>
  );
}
