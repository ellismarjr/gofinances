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
        <HighlightCard
          type="up"
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount="R$ 1.259,00"
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 à 16 de abril"
        />
      </HighlightCards>
    </Container>
  );
}