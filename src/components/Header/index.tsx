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
  UserName,
  LogoutButton
} from './styles';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { signOut, user } = useAuth();
  
  return (
    <Container>
      <UserWrapper>
        <UserInfo>
          <Photo source={{ uri: user?.photo }} />
          <User>
            <UserGretting>Olá,</UserGretting>
            <UserName>{user?.name}</UserName>
          </User>
        </UserInfo>
        <LogoutButton onPress={signOut}>
          <Feather name="power" size={24} color={theme.colors.attention} />
        </LogoutButton>
      </UserWrapper>
    </Container>
  );
}