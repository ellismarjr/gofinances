import React, { useContext } from 'react';
import { createContext, ReactNode, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

type AuthContextData = {
  user: User | undefined;
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



  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}