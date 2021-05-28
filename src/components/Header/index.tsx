import React from 'react';
import { Feather } from '@expo/vector-icons';

import theme from '../../global/styles/theme';

import {
  Container,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGretting,
  UserName
} from './styles';

export function Header() {
  return (
    <Container>
      <UserWrapper>
        <UserInfo>
          <Photo source={{ uri: 'http://github.com/ellismarjr.png' }} />
          <User>
            <UserGretting>Olá,</UserGretting>
            <UserName>Júnior</UserName>
          </User>
        </UserInfo>
        <Feather name="power" size={24} color={theme.colors.attention} />
      </UserWrapper>
    </Container>
  );
}