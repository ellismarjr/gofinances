import React, { useState } from 'react';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
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

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup.number().typeError('Inform um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('Preço é obrigatório')
});


export function NewTransaction() {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

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
    if (!transactionType) {
      return Alert.alert('Escolha um tipo de transação');
    }

    if (category.key === 'category') {
      return Alert.alert('Escolha uma categoria');
    }

    const data = {
      name: formData.name,
      amount: formData.amount,
      transactionType,
      category: category.key
    }
    console.log(data)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
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
    </TouchableWithoutFeedback>
  );
}