import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import NetInfo from '@react-native-community/netinfo';
import { databaseService } from '../services/databaseService';
import { taskService } from '../services/taskService';

interface NetworkContextData {
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextData>({
  isOnline: true,
});

function useNetworkState() {
  const [isOnline, setIsOnline] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Inicializa o banco
        await databaseService.init();

        // Carrega o estado da conexão
        const state = await NetInfo.fetch();
        const online = state.isConnected === true;

        setIsOnline(online);
        taskService.setNetworkState({ isOnline: online });
        setIsInitialized(true);
      } catch (error) {
        console.error('NetworkContext: Erro na inicialização:', error);
        setIsInitialized(true);
      }
    };

    initialize();

    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected === true;
      setIsOnline(online);
      taskService.setNetworkState({ isOnline: online });
    });

    return () => unsubscribe();
  }, []);

  return { isOnline, isInitialized };
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const { isOnline, isInitialized } = useNetworkState();
  const isSyncing = useRef(false);

  // Sincroniza quando ficar online e estiver inicializado
  useEffect(() => {
    const sync = async () => {
      if (isOnline && isInitialized && !isSyncing.current) {
        try {
          console.log('NetworkContext: Iniciando sincronização...');
          isSyncing.current = true;

          // Busca tasks não sincronizadas
          const unsynced = await databaseService.getUnsynced();
          console.log('NetworkContext: Tasks não sincronizadas:', unsynced);

          // Separa as tasks por status
          const tasksCreated = unsynced.filter(t => t.syncStatus === 'created');
          const tasksUpdated = unsynced.filter(t => t.syncStatus === 'updated');
          const tasksDeleted = unsynced
            .filter(t => t.syncStatus === 'deleted')
            .map(t => t.id); // Apenas os IDs das tasks deletadas

          // Inicia a sincronização apenas se houver tasks para sincronizar
          if (
            tasksCreated.length > 0 ||
            tasksUpdated.length > 0 ||
            tasksDeleted.length > 0
          ) {
            await taskService.syncTasks({
              tasksCreated,
              tasksUpdated,
              tasksDeleted,
              lastSync: new Date().toISOString(),
            });
          } else {
            console.log('NetworkContext: Nenhuma task para sincronizar');
          }

          console.log('NetworkContext: Sincronização concluída');
        } catch (error) {
          console.error('NetworkContext: Erro na sincronização:', error);
        } finally {
          isSyncing.current = false;
        }
      }
    };

    sync();
  }, [isOnline, isInitialized]);

  // Não renderiza nada até estar inicializado
  if (!isInitialized) {
    return null;
  }

  return (
    <NetworkContext.Provider value={{ isOnline }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }

  return context;
}
