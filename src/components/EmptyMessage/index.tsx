import React from 'react';

import emptyImage from '../../assets/images/empty-list.png';

import {
  Container,
  Image,
  Title,
  Message
} from './styles';

interface EmptyMessageProps {
  title: string;
  message: string;
}

export function EmptyMessage({ title, message }: EmptyMessageProps) {
  return (
    <Container>
      <Image source={emptyImage} />
      <Title>{title}</Title>
      <Message>{message}</Message>
    </Container>
  );
}