import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from '../../components/HistoryCard';
import { asyncStorageDataKey } from '../../shared/constants';

import { categories } from '../../utils/categories';
import { currencyFormat } from '../../utils/currencyFormat';

import { Transaction } from '../Dashboard';

import {
  Container,
  Header,
  Title,
  Content
} from './styles';
import { ScrollView } from 'react-native';
import { EmptyMessage } from '../../components/EmptyMessage';
import { useFocusEffect } from '@react-navigation/core';

interface CategoryData {
  id: string;
  name: string;
  total: string;
  color: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  async function loadData() {
    const response = await AsyncStorage.getItem(asyncStorageDataKey);

    const responseParsed: Transaction[] = response ? JSON.parse(response) : [];

    const expensives = responseParsed.filter(expensive => expensive.type === 'negative');

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach(expensive => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        totalByCategory.push({
          id: category.key,
          name: category.name,
          total: currencyFormat(categorySum),
          color: category.color
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
            {totalByCategories.map(category => (
              <HistoryCard
                key={category.id}
                title={category.name}
                amount={category.total}
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