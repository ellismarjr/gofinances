import styled from 'styled-components/native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { BorderlessButton } from 'react-native-gesture-handler';


export const Container = styled.SafeAreaView`
  width: 100%;
  height: ${RFPercentage(42)}px;

  background: ${({ theme }) => theme.colors.primary};
`;

export const UserWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  padding: 0 24px;
  margin-top: ${getStatusBarHeight() + RFValue(28)}px;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Photo = styled.Image`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;

  border-radius: 8px;
`;

export const User = styled.View`
  margin-left: 17px;
`;

export const UserGretting = styled.Text`
  color: ${({ theme }) => theme.colors.shape};
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
`;

export const UserName = styled.Text`
  color: ${({ theme }) => theme.colors.shape};
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${RFValue(18)}px;
`;

export const LogoutButton = styled(BorderlessButton)``;