import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Image = styled.Image`
  width: ${RFValue(128)}px;
  height: ${RFValue(128)}px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.title};
  font-size: ${RFValue(24)}px;

  margin-top: 30px;
`;

export const Message = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(18)}px;

  text-align: center;
`;
