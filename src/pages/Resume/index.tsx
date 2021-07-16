import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from 'styled-components';

import { HistoryCard } from '../../components/HistoryCard';
import { ITransactionCard } from '../../components/TransactionCard';
import { EmptyMessage } from '../../components/EmptyMessage';

import { asyncStorageDataKey } from '../../shared/constants';

import { categories } from '../../utils/categories';
import { currencyFormat } from '../../utils/currencyFormat';

import { Transaction } from '../Dashboard';

import {
  Container,
  LoadContaienr,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month
} from './styles';

interface CategoryData {
  id: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const theme = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
    } else {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }
  }

  async function loadData() {
    setIsLoading(true);
    const response = await AsyncStorage.getItem(asyncStorageDataKey);

    const responseParsed: Transaction[] = response ? JSON.parse(response) : [];

    const expensives = responseParsed.filter(expensive =>
      expensive.type === 'negative' &&
      new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
      new Date(expensive.date).getFullYear() === selectedDate.getFullYear());

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
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
    loadData()
  }, [selectedDate]));

  return (
    <Container>

      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {isLoading ? (
        <LoadContaienr>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContaienr>
      ) :
        <>
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('prev')}>
              <MonthSelectIcon name="chevron-left" size={24} />
            </MonthSelectButton>

            <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name="chevron-right" size={24} />
            </MonthSelectButton>
          </MonthSelect>

          {totalByCategories.length > 0
            ? (
              <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 24,
                  paddingBottom: bottomTabBarHeight
                }}
              >
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
              <EmptyMessage title="Poxa" message="Nenhuma transação encontrada!" />
            )}
        </>
      }
    </Container>
  );
}