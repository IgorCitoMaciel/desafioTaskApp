import React from 'react';
import { ListRenderItem } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTaskList } from './hooks/useTaskList';
import {
  Container,
  Content,
  EmptyStateContainer,
  EmptyStateText,
} from './styles';
import { TaskList as TaskListComponent } from '../../components/TaskList';

export function TaskList() {
  const { tasks, isLoading, handleToggleTask, handleDeleteTask } =
    useTaskList();

  if (isLoading) {
    return (
      <Container>
        <Content>
          <EmptyStateContainer>
            <EmptyStateText>Carregando tarefas...</EmptyStateText>
          </EmptyStateContainer>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        {tasks.length > 0 ? (
          <TaskListComponent
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <EmptyStateContainer>
            <EmptyStateText>
              Você ainda não tem tarefas cadastradas.{'\n'}
              Crie uma nova tarefa para começar! ✨
            </EmptyStateText>
          </EmptyStateContainer>
        )}
      </Content>
    </Container>
  );
}
export default TaskList;
