import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/core';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';

import { Header } from '../../components/Header';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, ITransactionCard } from '../../components/TransactionCard';

import { asyncStorageDataKey } from '../../shared/constants';
import { currencyFormat } from '../../utils/currencyFormat';

import {
  Container,
  HighlightCards,
  Transactions,
  Title,
  TrnsactionsList,
  LoadContaienr
} from './styles';

export interface DataListProps extends ITransactionCard {
  id: string;
}

interface HightlightProps {
  amount: string;
}

interface HightlightData {
  entries: HightlightProps;
  expensives: HightlightProps;
  total: string;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<DataListProps[]>();
  const [hightlightData, setHightlightData] = useState<HightlightData>({} as HightlightData);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();

  async function getAllTransactions() {
    const response = await AsyncStorage.getItem(asyncStorageDataKey);

    const responseParsed = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] =
      responseParsed.map((transaction: DataListProps) => {
        if (transaction.type === 'positive') {
          entriesTotal += Number(transaction.amount);
        } else {
          expensiveTotal += Number(transaction.amount);
        }

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

    const amountTotalResult = entriesTotal - expensiveTotal;

    setHightlightData({
      entries: {
        amount: currencyFormat(entriesTotal),
      },
      expensives: {
        amount: currencyFormat(expensiveTotal),
      },
      total: currencyFormat(amountTotalResult)
    });

    setTransactions(transactionsFormatted);
    setIsLoading(false);
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
      {isLoading ? (
        <LoadContaienr>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContaienr>
      )
        : (
          <>
            <Header />

            <HighlightCards>
              <HighlightCard
                type="up"
                title="Entradas"
                amount={hightlightData.entries.amount}
                lastTransaction="Última entrada dia 13 de abril"
              />
              <HighlightCard
                type="down"
                title="Saídas"
                amount={hightlightData.expensives.amount}
                lastTransaction="Última saída dia 03 de abril"
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={hightlightData.total}
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
          </>
        )}
    </Container>
  );
}