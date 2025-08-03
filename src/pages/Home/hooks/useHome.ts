import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/app.routes';
import { taskService } from '../../../services/taskService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

export function useHome() {
  const navigation = useNavigation<NavigationProp>();
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
  });

  const loadStats = useCallback(async () => {
    try {
      const tasks = await taskService.getAllTasks();

      const newStats = {
        total: tasks.length,
        completed: tasks.filter(task => task.status === 'COMPLETED').length,
        pending: tasks.filter(task => task.status === 'PENDING').length,
      };

      console.log('Estatísticas atualizadas:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, []);

  // Carrega as estatísticas na montagem do componente
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Atualiza as estatísticas quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats]),
  );

  const handleCreateTask = async (data: {
    title: string;
    description: string;
  }) => {
    try {
      await taskService.createTask(data);
      Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
      loadStats(); // Recarrega as estatísticas após criar uma task
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar tarefa. Tente novamente.');
    }
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Bom dia!';
    if (hour < 18) return '☀️ Boa tarde!';
    return '🌙 Boa noite!';
  };

  return {
    stats,
    navigation,
    handleCreateTask,
    getCurrentGreeting,
  };
}
