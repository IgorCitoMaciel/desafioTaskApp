import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { taskService } from '../../../services/taskService';
import { Task, TaskStatus } from '../../../types/Task';

export function useTaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await taskService.getAllTasks();
      // Filtra apenas as tasks com status PENDING
      const pendingTasks = response.filter(task => task.status === 'PENDING');
      setTasks(pendingTasks);
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
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      Alert.alert('Confirmar', 'Tem certeza que deseja concluir esta tarefa?', [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              await taskService.updateTaskStatus(id, TaskStatus.COMPLETED);
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
      await loadTasks(); // Recarrega a lista após deletar
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
