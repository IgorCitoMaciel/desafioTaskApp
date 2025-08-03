import { useCallback, useState } from 'react';
import { Task, TaskStatus } from '../types/Task';
import { taskService } from '../services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Erro ao buscar tarefas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (title: string, description: string) => {
      setLoading(true);
      try {
        await taskService.createTask({ title, description });
        await fetchTasks();
        setError(null);
      } catch (e: any) {
        setError(e.message || 'Erro ao criar tarefa');
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks],
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      setLoading(true);
      try {
        await taskService.updateTaskStatus(taskId, status);
        await fetchTasks();
        setError(null);
      } catch (e: any) {
        setError(e.message || 'Erro ao atualizar tarefa');
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      setLoading(true);
      try {
        await taskService.deleteTask(taskId);
        await fetchTasks();
        setError(null);
      } catch (e: any) {
        setError(e.message || 'Erro ao remover tarefa');
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks],
  );

  const pendingTasks = tasks.filter(
    t => t.status === TaskStatus.PENDING && t.syncStatus !== 'deleted',
  );
  const completedTasks = tasks.filter(
    t => t.status === TaskStatus.COMPLETED && t.syncStatus !== 'deleted',
  );
  const pendingSyncCount = tasks.filter(t => t.syncStatus !== 'synced').length;

  return {
    tasks,
    loading,
    error,
    pendingTasks,
    completedTasks,
    pendingSyncCount,
    fetchTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
  };
}
