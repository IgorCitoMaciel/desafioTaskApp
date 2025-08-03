import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { taskService, Task } from '../../../services/taskService';

export function useCompletedTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await taskService.getAllTasks();
      // Filtra apenas as tasks com status COMPLETED
      const completedTasks = response.filter(
        task => task.status === 'COMPLETED',
      );
      setTasks(completedTasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar as tarefas. Tente novamente.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      Alert.alert('Confirmar', 'Deseja reverter esta tarefa para pendente?', [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              await taskService.updateTaskStatus(id, 'PENDING');
              await loadTasks();
            } catch (error) {
              console.error('Erro ao atualizar tarefa:', error);
              Alert.alert(
                'Erro',
                'Não foi possível atualizar a tarefa. Tente novamente.',
              );
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      Alert.alert(
        'Erro',
        'Não foi possível atualizar a tarefa. Tente novamente.',
      );
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      Alert.alert(
        'Erro',
        'Não foi possível excluir a tarefa. Tente novamente.',
      );
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    isLoading,
    handleToggleTask,
    handleDeleteTask,
  };
}
