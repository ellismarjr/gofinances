import React, { useCallback, useContext, useEffect } from 'react';
import * as Google from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { createContext, ReactNode, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {CLIENT_ID} = process.env;
const {REDIRECT_URI} = process.env;

const STORAGE_KEY = '@gofinances:user';

type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

type AuthContextData = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

interface AuthorizationResponse {
  params: {
    access_token: string;
  },
  type: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [isLoading, setIsLoading] = useState(false);
  
const signInWithGoogle = useCallback(async () =>{
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const {type,params} = await Google.startAsync({ authUrl }) as AuthorizationResponse;

      if (type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();

        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture
        };
        
        setUser(userLogged);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userLogged));
      }

    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });

      if (credentials) {
        const name = credentials.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&lenght=1`;
        const userLogged = {
          id: String(credentials.user),
          email: credentials.email!,
          name,
          photo
        };

        setUser(userLogged);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userLogged));
      }      
    } catch (error: any) {
      throw new Error(error);
    }

  },[]);

  const signOut = useCallback(async () => {
    setUser({} as User);
    await AsyncStorage.removeItem(STORAGE_KEY); 
  }, []);


  useEffect(() => {
    async function loadStorageData() {
      setIsLoading(true);
      const storageUser = await AsyncStorage.getItem(STORAGE_KEY);

      if (storageUser) {
        const userLogged = JSON.parse(storageUser) as User;
        setUser(userLogged);
      }
      setIsLoading(false);
    }

    loadStorageData();
  },[]);

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      signInWithApple,
      signOut,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}