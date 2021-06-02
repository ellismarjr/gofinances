import React from 'react';
import { FlatList } from 'react-native';
import { Button } from '../../components/Form/Button';
import { categories } from '../../utils/categories';
import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';

interface ICategory {
  key: string;
  name: string;
}

interface CategorySelectProps {
  category: ICategory;
  setCategory: (category: ICategory) => void;
  onClose: () => void;
}

export function CategorySelect({
  category,
  setCategory,
  onClose
}: CategorySelectProps) {
  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>
    
      <FlatList
        data={categories}
        style={{flex: 1, width: '100%'}}
        keyExtractor={(item) => item.key}
        renderItem={({item}) => (
          <Category
            onPress={() => setCategory(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon}/>
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <Button onPress={onClose} title="Selecionar"/>
      </Footer>
    </Container>
  );
}