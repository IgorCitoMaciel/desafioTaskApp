import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../pages/Home';
import { TaskList } from '../pages/TaskList';
import { CompletedTasks } from '../pages/CompletedTasks';

export type RootStackParamList = {
  Home: undefined;
  TaskList: undefined;
  CompletedTasks: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="TaskList"
        component={TaskList}
        options={{
          headerShown: true,
          headerTitle: 'Minhas Tarefas',
          headerBackTitle: 'Voltar',
          headerStyle: {
            backgroundColor: '#7d91ed',
          },
          headerTitleStyle: {
            color: '#fff',
          },
          headerTintColor: '#fff',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="CompletedTasks"
        component={CompletedTasks}
        options={{
          headerShown: true,
          headerTitle: 'Tarefas Concluídas',
          headerBackTitle: 'Voltar',
          headerStyle: {
            backgroundColor: '#7d91ed',
          },
          headerTitleStyle: {
            color: '#fff',
          },
          headerTintColor: '#fff',
          headerShadowVisible: true,
        }}
      />
    </Stack.Navigator>
  );
}
