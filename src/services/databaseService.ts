import SQLite from 'react-native-sqlite-storage';
import { Task, TaskStatus, SyncStatus } from '../types/Task';

SQLite.enablePromise(true);

const DATABASE_NAME = 'tasks.db';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    try {
      console.log('DatabaseService: Iniciando criação do banco de dados...');

      // Abre ou cria o banco
      this.db = await SQLite.openDatabase({
        name: DATABASE_NAME,
        location: 'default',
      });

      // Garante que a tabela existe com a estrutura correta
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT CHECK(status IN ('PENDING', 'COMPLETED')) NOT NULL DEFAULT 'PENDING',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          sync_status TEXT CHECK(sync_status IN ('synced', 'created', 'updated', 'deleted')) NOT NULL DEFAULT 'created'
        )
      `);

      this.isInitialized = true;
      console.log('DatabaseService: Banco inicializado com sucesso');
    } catch (error) {
      console.error('DatabaseService: Erro ao inicializar banco:', error);
      throw error;
    }
  }

  private async ensureConnection(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db || !this.isInitialized) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('DatabaseService: Banco não inicializado');
    }
    return this.db;
  }

  async getAllTasks(): Promise<Task[]> {
    const db = await this.ensureConnection();
    try {
      const [result] = await db.executeSql(`
        SELECT * FROM tasks WHERE sync_status != 'deleted' ORDER BY created_at DESC
      `);

      const tasks: Task[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        tasks.push({
          id: row.id,
          title: row.title,
          description: row.description,
          status: row.status as TaskStatus,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          syncStatus: row.sync_status as SyncStatus,
        });
      }

      return tasks;
    } catch (error) {
      console.error('DatabaseService: Erro ao buscar tasks:', error);
      throw error;
    }
  }

  // busca tasks nao sincronizadas
  async getUnsynced(): Promise<Task[]> {
    const db = await this.ensureConnection();
    try {
      const [result] = await db.executeSql(`
        SELECT * FROM tasks WHERE sync_status != 'synced' ORDER BY created_at ASC
      `);

      const tasks: Task[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        tasks.push({
          id: row.id,
          title: row.title,
          description: row.description,
          status: row.status as TaskStatus,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          syncStatus: row.sync_status as SyncStatus,
        });
      }

      return tasks;
    } catch (error) {
      console.error(
        'DatabaseService: Erro ao buscar tasks não sincronizadas:',
        error,
      );
      throw error;
    }
  }

  async saveTask(task: Task): Promise<void> {
    const db = await this.ensureConnection();
    try {
      await db.transaction(async tx => {
        await tx.executeSql(
          `INSERT OR REPLACE INTO tasks (
            id, title, description, status, created_at, updated_at, sync_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            task.id,
            task.title,
            task.description,
            task.status,
            task.createdAt,
            task.updatedAt,
            task.syncStatus,
          ],
        );
        console.log('DatabaseService: Task salva com sucesso:', task.id);
      });
    } catch (error) {
      console.error('DatabaseService: Erro ao salvar task:', error);
      throw error;
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    const db = await this.ensureConnection();
    try {
      await db.transaction(async tx => {
        for (const task of tasks) {
          await tx.executeSql(
            `INSERT OR REPLACE INTO tasks (
              id, title, description, status, created_at, updated_at, sync_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              task.id,
              task.title,
              task.description,
              task.status,
              task.createdAt,
              task.updatedAt,
              task.syncStatus,
            ],
          );
        }
      });
      console.log('DatabaseService: Tasks salvas em lote:', tasks.length);
    } catch (error) {
      console.error('DatabaseService: Erro ao salvar tasks em lote:', error);
      throw error;
    }
  }

  async markAsSynced(taskId: string): Promise<void> {
    const db = await this.ensureConnection();
    try {
      await db.transaction(async tx => {
        await tx.executeSql('UPDATE tasks SET sync_status = ? WHERE id = ?', [
          'synced',
          taskId,
        ]);
      });
      console.log('DatabaseService: Task marcada como sincronizada:', taskId);
    } catch (error) {
      console.error(
        'DatabaseService: Erro ao marcar task como sincronizada:',
        error,
      );
      throw error;
    }
  }

  async markTasksAsSynced(taskIds: string[]): Promise<void> {
    const db = await this.ensureConnection();
    try {
      await db.transaction(async tx => {
        const placeholders = taskIds.map(() => '?').join(',');
        const params = ['synced', ...taskIds];
        await tx.executeSql(
          `UPDATE tasks SET sync_status = ? WHERE id IN (${placeholders})`,
          params,
        );
      });
      console.log(
        'DatabaseService: Tasks marcadas como sincronizadas:',
        taskIds.length,
      );
    } catch (error) {
      console.error(
        'DatabaseService: Erro ao marcar tasks como sincronizadas:',
        error,
      );
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    const db = await this.ensureConnection();
    try {
      await db.transaction(async tx => {
        await tx.executeSql('UPDATE tasks SET sync_status = ? WHERE id = ?', [
          'deleted',
          taskId,
        ]);
      });
      console.log('DatabaseService: Task marcada como deletada:', taskId);
    } catch (error) {
      console.error(
        'DatabaseService: Erro ao marcar task como deletada:',
        error,
      );
      throw error;
    }
  }

  async recreateDatabase(): Promise<void> {
    const db = await this.ensureConnection();
    try {
      await db.transaction(async tx => {
        await tx.executeSql('DROP TABLE IF EXISTS tasks');
      });

      console.log('DatabaseService: Tabelas removidas');
      this.isInitialized = false;
      await this.init();
    } catch (error) {
      console.error('DatabaseService: Erro ao recriar banco:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
