import React, { useState } from 'react';
import { Modal } from 'react-native';

import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsType
} from './styles';
import { CategorySelect } from '../CategorySelect';

export function NewTransaction() {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Category'
  });
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  function handleTrnasactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
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

          <CategorySelectButton onPress={handleOpenSelectCategoryModal} title={category.name} />
        </Fields>

        <Button title="Enviar" />
      </Form>

      <Modal
        visible={categoryModalOpen}
      >
        <CategorySelect
          category={category}
          setCategory={setCategory}
          onClose={handleCloseSelectCategoryModal}
        />
      </Modal>
    </Container>
  );
}