import { Task, TaskStatus } from '../types/Task';
import api from './api';
import { databaseService } from './databaseService';

interface SyncPayload {
  tasksCreated: Task[];
  tasksUpdated: Task[];
  tasksDeleted: string[];
  lastSync: string;
}

class TaskService {
  private networkState: { isOnline: boolean } = { isOnline: false };

  setNetworkState(state: { isOnline: boolean }) {
    console.log('TaskService: Network state changed:', state);
    this.networkState = state;
  }

  private isOnline(): boolean {
    return this.networkState.isOnline;
  }

  private async ensureConnection(): Promise<boolean> {
    try {
      if (!this.isOnline()) {
        console.log('TaskService: Sem conexão com a internet');
        return false;
      }

      // Tenta fazer uma chamada simples para verificar a conexão real com o servidor
      await api.get('/tasks');
      return true;
    } catch (error) {
      console.error('TaskService: Erro ao verificar conexão:', error);
      return false;
    }
  }

  async getAllTasks(): Promise<Task[]> {
    console.log('TaskService: Getting all tasks');
    try {
      // Busca tasks do banco local
      const localTasks = await databaseService.getAllTasks();
      console.log('TaskService: Tasks locais:', localTasks);

      // Se estiver online, busca do servidor e combina com tasks locais
      if (await this.ensureConnection()) {
        try {
          const response = await api.get('/tasks');
          const serverTasks = response.data.data;
          console.log('TaskService: Tasks do servidor:', serverTasks);

          // Combina tasks do servidor com tasks locais não sincronizadas
          const allTasks = [
            ...serverTasks,
            ...localTasks.filter(
              task =>
                task.id.startsWith('local_') && task.syncStatus === 'created',
            ),
          ];

          // Filtra tasks deletadas
          const activeTasks = allTasks.filter(
            task => task.syncStatus !== 'deleted',
          );

          console.log('TaskService: Todas as tasks combinadas:', activeTasks);
          return activeTasks;
        } catch (error) {
          console.error(
            'TaskService: Erro ao buscar do servidor, retornando tasks locais:',
            error,
          );
          // Se falhar ao buscar do servidor, retorna tasks locais não deletadas
          return localTasks.filter(task => task.syncStatus !== 'deleted');
        }
      }

      // Se offline, retorna tasks locais não deletadas
      const activeTasks = localTasks.filter(
        task => task.syncStatus !== 'deleted',
      );
      console.log(
        'TaskService: Retornando tasks locais (offline):',
        activeTasks,
      );
      return activeTasks;
    } catch (error) {
      console.error('TaskService: Error getting tasks:', error);
      return [];
    }
  }

  async createTask(data: {
    title: string;
    description: string;
  }): Promise<Task> {
    console.log('TaskService: Creating task:', data);
    try {
      const now = new Date().toISOString();

      // Se offline, salva localmente com ID temporário
      if (!this.isOnline()) {
        const newTask: Task = {
          id: `local_${Date.now()}`,
          title: data.title,
          description: data.description,
          status: TaskStatus.PENDING,
          createdAt: now,
          updatedAt: now,
          syncStatus: 'created',
        };
        await databaseService.saveTask(newTask);
        return newTask;
      }

      // Se online, cria no servidor
      const response = await api.post('/tasks', data);
      const serverTask = response.data;
      return serverTask;
    } catch (error) {
      console.error('TaskService: Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    console.log('TaskService: Updating task:', id, updates);
    try {
      const now = new Date().toISOString();

      // Se offline ou for uma task local
      if (!this.isOnline() || id.startsWith('local_')) {
        const currentTask = (await databaseService.getAllTasks()).find(
          t => t.id === id,
        );
        if (!currentTask) {
          throw new Error('Task not found');
        }

        const updatedTask: Task = {
          ...currentTask,
          ...updates,
          updatedAt: now,
          // Se já é uma task local, mantém como 'created', senão marca como 'updated'
          syncStatus: currentTask.id.startsWith('local_')
            ? 'created'
            : 'updated',
        };

        await databaseService.saveTask(updatedTask);
        return updatedTask;
      }

      // Se online e for uma task do servidor
      const response = await api.patch(`/tasks/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('TaskService: Error updating task:', error);
      throw error;
    }
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(taskId, { status });
  }

  async deleteTask(taskId: string): Promise<void> {
    console.log('TaskService: Deleting task:', taskId);
    try {
      // Se estiver offline, apenas marca como deletada no banco local
      if (!this.isOnline()) {
        await databaseService.deleteTask(taskId);
        return;
      }

      // Se estiver online
      try {
        // Tenta deletar no servidor primeiro
        await api.delete(`/tasks/${taskId}`);
        console.log('TaskService: Task deleted from server:', taskId);
      } catch (error: any) {
        // Se a task não existe no servidor (400), apenas continua
        if (error.response?.status === 400) {
          console.log('TaskService: Task already deleted from server:', taskId);
        } else {
          throw error;
        }
      }

      // Sempre marca como deletada no banco local
      await databaseService.deleteTask(taskId);
    } catch (error) {
      console.error('TaskService: Error deleting task:', error);
      throw error;
    }
  }

  async syncTasks(payload: SyncPayload): Promise<Task[]> {
    console.log('TaskService: Starting sync with payload:', payload);
    if (!(await this.ensureConnection())) {
      console.log('TaskService: Offline, skipping sync');
      return await databaseService.getAllTasks();
    }

    try {
      // Busca todas as tasks não sincronizadas
      const unsynced = await databaseService.getUnsynced();
      console.log('TaskService: Tasks não sincronizadas:', unsynced);

      // Primeiro busca as tasks do servidor para saber quais existem
      let serverResponse = await api.get('/tasks');
      let serverTasks: Task[] = serverResponse.data.data;
      const serverTaskIds = new Set(serverTasks.map(t => t.id));

      // Processa as deleções
      const deleted = unsynced.filter(t => t.syncStatus === 'deleted');

      // Remove todas as tasks locais primeiro
      const localDeleted = deleted.filter(t => t.id.startsWith('local_'));
      for (const task of localDeleted) {
        console.log('TaskService: Removendo task local:', task.id);
        await databaseService.deleteTask(task.id);
      }

      // Tenta deletar apenas as tasks que ainda existem no servidor
      const serverDeleted = deleted.filter(t => !t.id.startsWith('local_'));
      const deletePromises = serverDeleted.map(async task => {
        // Se a task não existe mais no servidor, apenas remove localmente
        if (!serverTaskIds.has(task.id)) {
          console.log(
            'TaskService: Task já não existe no servidor, removendo localmente:',
            task.id,
          );
          await databaseService.deleteTask(task.id);
          return;
        }

        try {
          console.log(
            'TaskService: Tentando deletar task do servidor:',
            task.id,
          );
          await api.delete(`/tasks/${task.id}`);
          console.log('TaskService: Task deletada com sucesso:', task.id);
        } catch (error: any) {
          // Se der erro 400, significa que a task já foi deletada
          if (error.response?.status === 400) {
            console.log(
              'TaskService: Task já não existe no servidor:',
              task.id,
            );
          } else {
            console.error('TaskService: Erro ao deletar task:', error);
          }
        }
        // Independente do resultado, remove do banco local
        await databaseService.deleteTask(task.id);
      });

      // Aguarda todas as deleções terminarem
      await Promise.all(deletePromises);

      // Busca lista atualizada do servidor
      serverResponse = await api.get('/tasks');
      serverTasks = serverResponse.data.data;

      // Processa tasks criadas offline
      const created = unsynced.filter(
        t => t.id.startsWith('local_') && t.syncStatus === 'created',
      );

      // Cria todas as tasks no servidor
      const createdPromises = created.map(async task => {
        try {
          console.log('TaskService: Sincronizando task criada offline:', task);

          // Primeiro cria a task com título e descrição
          const response = await api.post('/tasks', {
            title: task.title,
            description: task.description,
          });
          console.log('TaskService: Task criada no servidor:', response.data);

          let finalTask = response.data;

          // Se o status for diferente de PENDING, atualiza em seguida
          if (task.status !== TaskStatus.PENDING) {
            console.log(
              'TaskService: Atualizando status da task recém-criada para:',
              task.status,
            );
            try {
              const updateResponse = await api.patch(`/tasks/${finalTask.id}`, {
                status: task.status,
              });
              console.log(
                'TaskService: Status atualizado no servidor:',
                updateResponse.data,
              );
              finalTask = updateResponse.data;
            } catch (error) {
              console.error(
                'TaskService: Erro ao atualizar status da task:',
                error,
              );
            }
          }

          // Remove a versão local
          await databaseService.deleteTask(task.id);

          return finalTask;
        } catch (error) {
          console.error('TaskService: Error syncing created task:', error);
          return null;
        }
      });

      const createdResults = await Promise.all(createdPromises);
      const newServerTasks = createdResults.filter(
        (task): task is Task => task !== null,
      );
      serverTasks = [...serverTasks, ...newServerTasks];

      // Processa atualizações de tasks do servidor
      const updated = unsynced.filter(
        t => !t.id.startsWith('local_') && t.syncStatus === 'updated',
      );

      // Atualiza apenas as tasks que ainda existem no servidor
      const updatedPromises = updated.map(async task => {
        // Se a task não existe mais no servidor, apenas remove localmente
        if (!serverTaskIds.has(task.id)) {
          console.log(
            'TaskService: Task não existe mais no servidor, removendo localmente:',
            task.id,
          );
          await databaseService.deleteTask(task.id);
          return null;
        }

        try {
          console.log('TaskService: Sincronizando atualização:', task);

          const updateData = {
            title: task.title,
            description: task.description,
            status: task.status,
          };

          const response = await api.patch(`/tasks/${task.id}`, updateData);
          console.log(
            'TaskService: Task atualizada no servidor:',
            response.data,
          );

          return response.data;
        } catch (error: any) {
          if (error.response?.status === 400) {
            console.log(
              'TaskService: Task não existe mais no servidor, removendo localmente:',
              task.id,
            );
            await databaseService.deleteTask(task.id);
          } else {
            console.error('TaskService: Error syncing updated task:', error);
          }
          return null;
        }
      });

      const updatedResults = await Promise.all(updatedPromises);
      const updatedServerTasks = updatedResults.filter(
        (task): task is Task => task !== null,
      );

      // Atualiza as tasks existentes na lista do servidor
      updatedServerTasks.forEach(updatedTask => {
        const index = serverTasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          serverTasks[index] = updatedTask;
        } else {
          serverTasks.push(updatedTask);
        }
      });

      // Prepara todas as tasks para salvar no banco local
      const tasksToSave: Task[] = serverTasks.map(task => ({
        ...task,
        syncStatus: 'synced',
      }));

      // Salva todas as tasks de uma vez no banco local
      if (tasksToSave.length > 0) {
        await databaseService.saveTasks(tasksToSave);
      }

      console.log('TaskService: Tasks após sincronização:', serverTasks);
      return serverTasks;
    } catch (error) {
      console.error('TaskService: Error during sync:', error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
