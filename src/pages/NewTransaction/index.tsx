import React, { useState } from 'react';

import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsType
} from './styles';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

export function NewTransaction() {
  const [transactionType, setTransactionType] = useState('');

  function handleTrnasactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome" />
          <Input placeholder="Preço" />

          <TransactionsType>
            <TransactionTypeButton
              isActive={transactionType === 'up'}
              title="Income"
              type="up"
              onPress={() => handleTrnasactionTypeSelect('up')}
            />
            <TransactionTypeButton
            isActive={transactionType === 'down'}
              title="Outcome"
              type="down"
              onPress={() => handleTrnasactionTypeSelect('down')}
            />
          </TransactionsType>
        </Fields>

        <Button title="Enviar" />
      </Form>
    </Container>
  );
}