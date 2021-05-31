import React from 'react';


import { Header } from '../../components/Header';
import { HighlightCard } from '../../components/HighlightCard';


import {
  Container,
  HighlightCards
} from './styles';

export function Dashboard() {
  return (
    <Container>
      <Header />

      <HighlightCards>
        <HighlightCard />
        <HighlightCard />
        <HighlightCard />
      </HighlightCards>
    </Container>
  );
}