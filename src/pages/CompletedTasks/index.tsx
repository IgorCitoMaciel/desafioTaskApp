import React from 'react';
import { TaskList as TaskListComponent } from '../../components/TaskList';
import { useCompletedTasks } from './hooks/useCompletedTasks';
import {
  Container,
  Content,
  EmptyStateContainer,
  EmptyStateText,
} from './styles';

export function CompletedTasks() {
  const { tasks, isLoading, handleToggleTask, handleDeleteTask } =
    useCompletedTasks();

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
              Você ainda não tem tarefas concluídas.{'\n'}
              Complete algumas tarefas para vê-las aqui! ✨
            </EmptyStateText>
          </EmptyStateContainer>
        )}
      </Content>
    </Container>
  );
}

export default CompletedTasks;
