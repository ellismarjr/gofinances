import React, { useState } from 'react';
import { Modal } from 'react-native';

import { useForm } from 'react-hook-form';


import { Input } from '../../components/Form/Input';
import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsType
} from './styles';

interface FormData {
  name: string;
  amount: string;
}


export function NewTransaction() {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Category'
  });
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm();

  function handleTrnasactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleNewTransaction(formData: FormData) {
    const data = {
      name: formData.name,
      amount: formData.amount,
      transactionType,
      category: category.key
    }
    console.log(data)
  }



  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <InputForm
            name="name"
            control={control}
            placeholder="Nome"
          />
          <InputForm
            name="amount"
            control={control}
            placeholder="Preço"
          />

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

          <CategorySelectButton
            onPress={handleOpenSelectCategoryModal}
            title={category.name}
          />
        </Fields>

        <Button onPress={handleSubmit(handleNewTransaction)} title="Enviar" />
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