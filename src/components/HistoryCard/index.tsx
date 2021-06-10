import React, { useEffect, useState } from 'react';

import {
  Container,
  Title,
  Amount
} from './styles';

interface HistoryCardprops {
  color: string;
  title: string;
  amount: string;
}

export function HistoryCard({
  color,
  title,
  amount
}: HistoryCardprops) {
  
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
}