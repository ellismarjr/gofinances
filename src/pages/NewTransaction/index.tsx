import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/core';

import { useAuth } from '../../hooks/useAuth';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';

import { asyncStorageDataKey } from '../../shared/constants';

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
  amount: Yup.number().typeError('Informe um valor numérico')
    .positive('O preço não pode ser negativo')
    .required('Preço é obrigatório')
});

export function NewTransaction() {
  const { user } = useAuth();
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const navigation = useNavigation();

  function handleTrnasactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  async function handleNewTransaction(formData: FormData) {
    if (!transactionType) {
      return Alert.alert('Escolha um tipo de transação');
    }

    if (category.key === 'category') {
      return Alert.alert('Escolha uma categoria');
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: formData.name,
      amount: formData.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const dataKey = `@gofinances:transactions_user:${user?.id}`;
      const response = await AsyncStorage.getItem(dataKey);
      const currentData = response ? JSON.parse(response) : [];

      const dataFomatted = [
        ...currentData,
        newTransaction
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFomatted));

      reset()
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });
      navigation.navigate('Dashboard');

    } catch (err) {
      console.log(err);
      Alert.alert('Não foi possível salvar!');
    }
  }

  useEffect(() => {
    async function loadTransactions() {
      const response = await AsyncStorage.getItem(asyncStorageDataKey);
    }

    loadTransactions();
  }, []);

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
                isActive={transactionType === 'positive'}
                title="Income"
                type="up"
                onPress={() => handleTrnasactionTypeSelect('positive')}
              />
              <TransactionTypeButton
                isActive={transactionType === 'negative'}
                title="Outcome"
                type="down"
                onPress={() => handleTrnasactionTypeSelect('negative')}
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