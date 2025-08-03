import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Container, Input, SubmitButton, ButtonText } from './styles';

interface TaskFormProps {
  onSubmit: (task: { title: string; description: string }) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
    });

    setTitle('');
    setDescription('');
  };

  return (
    <Container>
      <Input
        placeholder="Título da tarefa"
        value={title}
        onChangeText={setTitle}
      />
      <Input
        placeholder="Descrição da tarefa"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={{ textAlignVertical: 'top' }}
      />
      <SubmitButton onPress={handleSubmit}>
        <ButtonText>Criar Tarefa</ButtonText>
      </SubmitButton>
    </Container>
  );
}
