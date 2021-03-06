import { FlatList, Platform } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

import { Transaction } from '.';


export const Container = styled.View`
  flex: 1;

  background: ${({ theme }) => theme.colors.background};
`;

export const HighlightCards = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingHorizontal: 24 }
})`
  width: 100%;
  
  position: absolute;
  margin-top: ${RFPercentage(17)}px;
`;

export const Transactions = styled.View`
  flex: 1;
  padding: 0 24px;
  
  margin-top: ${RFPercentage(8)}px;
`;

export const Title = styled.Text`
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-bottom: 16px;
`;

export const TrnsactionsList = styled(
  FlatList as new () => FlatList<Transaction>).attrs({
    showsVerticalScrollIndicator: false,
    paddingBottom: Platform.OS === 'ios' ? getBottomSpace() : 0
  })``;

export const LoadContaienr = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;