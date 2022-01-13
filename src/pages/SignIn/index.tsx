import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import { useAuth } from '../../hooks/useAuth';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import AppleSvg from '../../assets/images/apple.svg';
import GoogleSvg from '../../assets/images/google.svg';
import LogoSvg from '../../assets/images/logo.svg';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles';
import { ActivityIndicator, Alert } from 'react-native';
import theme from '../../global/styles/theme';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      return;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Alert.alert('Não foi possível conectar a conta Google');
    }
    
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      await signInWithApple();
      return;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Alert.alert('Não foi possível conectar a conta Apple');
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />

          <SignInSocialButton 
            title="Entrar com Apple"
            svg={AppleSvg}
            onPress={handleSignInWithApple} 
          />
        </FooterWrapper>

        {isLoading && <ActivityIndicator size={32} color={theme.colors.shape}/>}
      </Footer>
    </Container>
  );
}