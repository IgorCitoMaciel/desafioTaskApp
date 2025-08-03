# Task App com Suporte Offline

Aplicativo de gerenciamento de tarefas desenvolvido em React Native com suporte a operações offline.

## Funcionalidades

- ✅ Criar, atualizar e deletar tarefas
- 📱 Funciona offline e online
- 🔄 Sincronização automática quando volta online
- 📊 Visualização de tarefas pendentes e concluídas
- 🎯 Status de conexão em tempo real

## Tecnologias

- React Native
- TypeScript
- SQLite (banco de dados local)
- Axios (chamadas HTTP)
- @react-native-community/netinfo (monitoramento de conexão)

## Arquitetura

### Componentes Principais

- `NetworkContext`: Gerencia o estado de conectividade
- `TaskService`: Serviço central para operações com tasks
- `DatabaseService`: Interface com o banco SQLite local

### Estratégia Offline-First

1. **Criação de Tasks**

   - Online: Salva direto no servidor
   - Offline: Salva localmente com ID temporário

2. **Atualização de Tasks**

   - Online: Atualiza no servidor
   - Offline: Marca como "updated" para sincronização futura

3. **Deleção de Tasks**

   - Online: Remove do servidor
   - Offline: Marca como "deleted" para sincronização futura

4. **Sincronização**
   - Executada automaticamente ao reconectar
   - Processa deleções, criações e atualizações em ordem
   - Mantém consistência entre dados locais e servidor

## Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
├── contexts/          # Contextos React (NetworkContext)
├── pages/            # Telas do aplicativo
├── services/         # Serviços (API, Database, Task)
└── types/            # Definições de tipos TypeScript
```

## Como Executar

1. Clone o repositório:

```bash
git clone https://github.com/IgorCitoMaciel/desafioTaskApp.git
```

2. Instale as dependências:

```bash
cd desafioTaskApp
yarn install
```

3. Execute o projeto:

```bash
# iOS
yarn ios

# Android
yarn android
```

## Fluxo de Sincronização

1. **Monitoramento de Conexão**

   - `NetworkContext` monitora mudanças na conectividade
   - Notifica componentes sobre estado da conexão

2. **Operações Offline**

   - Tasks criadas recebem ID temporário (`local_timestamp`)
   - Mudanças são marcadas com status apropriado
   - Dados são salvos no SQLite

3. **Processo de Sincronização**
   - Verifica tasks não sincronizadas
   - Processa em ordem: deleções → criações → atualizações
   - Atualiza banco local com dados do servidor

## Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
