import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { TaskForm } from '../../components/TaskForm';
import { useHome } from './hooks/useHome';
import {
  Container,
  ScrollContainer,
  Content,
  HeroSection,
  WelcomeContainer,
  WelcomeTitle,
  WelcomeSubtitle,
  StatsContainer,
  StatsTitle,
  StatCard,
  StatNumber,
  StatLabel,
  FormSection,
  FormTitle,
} from './styles';

export function Home() {
  const { stats, navigation, handleCreateTask, getCurrentGreeting } = useHome();

  return (
    <Container>
      <Header title="Tarefas Pro" />

      <ScrollContainer showsVerticalScrollIndicator={false}>
        <Content>
          <HeroSection>
            <WelcomeContainer>
              <WelcomeTitle>{getCurrentGreeting()}</WelcomeTitle>
              <WelcomeSubtitle>
                Organize sua vida de forma inteligente.{'\n'}
                Produtividade ao seu alcance! ✨
              </WelcomeSubtitle>
            </WelcomeContainer>

            <StatsTitle>Estatísticas</StatsTitle>
            <StatsContainer>
              <TouchableOpacity
                onPress={() => navigation.navigate('TaskList')}
                activeOpacity={0.7}
              >
                <StatCard>
                  <StatNumber>{stats.pending}</StatNumber>
                  <StatLabel>Em{'\n'}Progresso</StatLabel>
                </StatCard>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('CompletedTasks')}
                activeOpacity={0.7}
              >
                <StatCard>
                  <StatNumber>{stats.completed}</StatNumber>
                  <StatLabel>Concluídas{'\n'}Hoje</StatLabel>
                </StatCard>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('TaskList')}
                activeOpacity={0.7}
              >
                <StatCard>
                  <StatNumber>{stats.total}</StatNumber>
                  <StatLabel>Total{'\n'}Tarefas</StatLabel>
                </StatCard>
              </TouchableOpacity>
            </StatsContainer>
          </HeroSection>

          <FormSection>
            <FormTitle>🎯 Criar Nova Tarefa</FormTitle>
            <TaskForm onSubmit={handleCreateTask} />
          </FormSection>
        </Content>
      </ScrollContainer>
    </Container>
  );
}

export default Home;
