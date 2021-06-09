import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/core';

import { Header } from '../../components/Header';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, ITransactionCard } from '../../components/TransactionCard';

import { asyncStorageDataKey } from '../../shared/constants';


import {
  Container,
  HighlightCards,
  Transactions,
  Title,
  TrnsactionsList
} from './styles';

export interface DataListProps extends ITransactionCard {
  id: string;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<DataListProps[]>();

  async function getAllTransactions() {
    const response = await AsyncStorage.getItem(asyncStorageDataKey);

    const responseParsed = response ? JSON.parse(response) : [];

    const transactionsFormatted: DataListProps[] =
      responseParsed.map((transaction: DataListProps) => {
        const amount = Number(transaction.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(transaction.date));

        return {
          id: transaction.id,
          name: transaction.name,
          amount,
          type: transaction.type,
          category: transaction.category,
          date
        }
      });

    setTransactions(transactionsFormatted);
  }


  useEffect(() => {
    getAllTransactions()
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllTransactions();
    }, [])
  );

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

      <Transactions>
        <Title>Listagem</Title>
        <TrnsactionsList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />

      </Transactions>

    </Container>
  );
}