export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export type SyncStatus = 'synced' | 'created' | 'updated' | 'deleted';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: TaskStatus;
}
