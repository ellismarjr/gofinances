import React from 'react';
import { useTheme } from 'styled-components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { Dashboard } from '../pages/Dashboard';
import { NewTransaction } from '../pages/NewTransaction';
import { Platform } from 'react-native';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Navigator
      tabBarOptions={{
        activeTintColor: theme.colors.secondary,
        inactiveTintColor: theme.colors.text,
        labelPosition: 'beside-icon',
        style: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 58
        }
      }}
    >
      <Screen
        options={{
          title: "Listagem",
          tabBarIcon: (({ size, color }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ))
        }}
        name="Dashboard"
        component={Dashboard}
      />

      <Screen
        options={{
          title: "Cadastrar",
          tabBarIcon: (({ size, color }) => (
            <MaterialIcons
              name="attach-money"
              size={size}
              color={color}
            />
          ))
        }}
        name="NewTransaction"
        component={NewTransaction}
      />

      <Screen
        options={{
          title: "Resumo",
          tabBarIcon: (({ size, color }) => (
            <MaterialIcons
              name="pie-chart"
              size={size}
              color={color}
            />
          ))
        }}
        name="Resumo"
        component={NewTransaction}
      />
    </Navigator>
  );
}