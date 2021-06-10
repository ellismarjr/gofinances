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
import { dateFormat } from '../../utils/dateFormat';

export interface Transaction extends ITransactionCard {
  id: string;
}

interface HightlightProps {
  amount: string;
  lastTransaction: string;
}

interface HightlightData {
  entries: HightlightProps;
  expensives: HightlightProps;
  total: HightlightProps;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [hightlightData, setHightlightData] = useState<HightlightData>({} as HightlightData);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();

  function getLastTransactionDate(transactionsData: Transaction[],
    type: 'positive' | 'negative') {
    const lastTransactions = Math.max.apply(Math, transactionsData
      .filter((transaction) => transaction.type === type)
      .map((transaction) => new Date(transaction.date).getTime()));

    const lastTransactionsDate = new Date(lastTransactions);
    const lastTransactionsFormatted = `${lastTransactionsDate.getDate()} de ${lastTransactionsDate.toLocaleString('pt-BR', { month: 'long' })}`;

    return lastTransactionsFormatted;
  }

  function getDateNowFormatted() {
    const date = new Date();
    const dateFormatted = `${date.getDate()} de ${date.toLocaleString('pt-BR', { month: 'long' })}`;
    return dateFormatted;
  }

  async function getAllTransactions() {
    const response = await AsyncStorage.getItem(asyncStorageDataKey);

    const transactionsParsed: Transaction[] = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: Transaction[] =
      transactionsParsed.map((transaction: Transaction) => {
        if (transaction.type === 'positive') {
          entriesTotal += Number(transaction.amount);
        } else {
          expensiveTotal += Number(transaction.amount);
        }

        const amount = currencyFormat(Number(transaction.amount));

        const date = dateFormat(transaction.date);

        return {
          id: transaction.id,
          name: transaction.name,
          amount,
          type: transaction.type,
          category: transaction.category,
          date
        }
      });

    const lastTransactionEntries = getLastTransactionDate(transactionsParsed, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactionsParsed, 'negative');
    const totalInterval = `01 à ${getDateNowFormatted()}`;

    const amountTotalResult = entriesTotal - expensiveTotal;

    setHightlightData({
      entries: {
        amount: currencyFormat(entriesTotal),
        lastTransaction: `Últim entrada dia ${lastTransactionEntries}`
      },
      expensives: {
        amount: currencyFormat(expensiveTotal),
        lastTransaction: `Última saída dia ${lastTransactionExpensives}`
      },
      total: {
        amount: currencyFormat(amountTotalResult),
        lastTransaction: totalInterval
      }
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
                lastTransaction={hightlightData.entries.lastTransaction}
              />
              <HighlightCard
                type="down"
                title="Saídas"
                amount={hightlightData.expensives.amount}
                lastTransaction={hightlightData.expensives.lastTransaction}
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={hightlightData.total.amount}
                lastTransaction={hightlightData.total.lastTransaction}
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