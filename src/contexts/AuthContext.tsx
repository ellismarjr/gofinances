import React, { useContext } from 'react';
import * as AuthSession from 'expo-auth-session';
import { createContext, ReactNode, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

type AuthContextData = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  // const [user, setUser] = useState<User>();
  const user = {
    id: '123',
    name: 'Júnior',
    email: 'júnior@email.com',
  }

  async function signInWithGoogle() {
    try {
      const CLIENT_ID = '829840799250-mtnn1v8a94uid973lnf574sk94mau39t.apps.googleusercontent.com';
      const REDIRECT_URI = 'https://auth.expo.io/@ellismarjr/gofinances';
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const response = await AuthSession.startAsync({ authUrl });
      console.log(response);

    } catch (error) {
      throw new Error(error);
    }
  }



  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
}