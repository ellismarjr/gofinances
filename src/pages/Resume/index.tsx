import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native'
import { useFocusEffect } from '@react-navigation/core';
import { RFValue } from 'react-native-responsive-fontsize';

import { HistoryCard } from '../../components/HistoryCard';
import { ITransactionCard } from '../../components/TransactionCard';
import { EmptyMessage } from '../../components/EmptyMessage';

import { asyncStorageDataKey } from '../../shared/constants';

import { categories } from '../../utils/categories';
import { currencyFormat } from '../../utils/currencyFormat';

import { Transaction } from '../Dashboard';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer
} from './styles';
import { useTheme } from 'styled-components';

interface CategoryData {
  id: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const theme = useTheme();

  async function loadData() {
    const response = await AsyncStorage.getItem(asyncStorageDataKey);

    const responseParsed: Transaction[] = response ? JSON.parse(response) : [];

    const expensives = responseParsed.filter(expensive => expensive.type === 'negative');

    const expensivesTotal = expensives.reduce((acc: number, expensive: ITransactionCard) => {
      return acc + Number(expensive.amount)
    }, 0);


    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach(expensive => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          id: category.key,
          name: category.name,
          total: categorySum,
          totalFormatted: currencyFormat(categorySum),
          color: category.color,
          percent
        });


      }
    });

    setTotalByCategories(totalByCategory);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []));

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {totalByCategories.length > 0
        ? (
          <Content>
            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={50}
                x="percent"
                y="totalFormatted"
              />
            </ChartContainer>
            {totalByCategories.map(category => (
              <HistoryCard
                key={category.id}
                title={category.name}
                amount={category.totalFormatted}
                color={category.color}
              />
            ))}
          </Content>
        )
        : (
          <EmptyMessage title="Poxa" message="Nenhuma transação feita ainda!" />
        )}


    </Container>
  );
}