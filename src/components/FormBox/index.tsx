import firestore from '@react-native-firebase/firestore';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ButtonIcon } from '../ButtonIcon';
import { Input } from '../Input';
import { Container } from './styles';


export function FormBox() {
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(0);

    async function handleProductAdd() {
        const product = {
            description,
            quantity,
            done: false,
            createdAt: firestore.FieldValue.serverTimestamp(),
        };

        await firestore()
            .collection('products')
            .add(product)
            .then(() => {
                Alert.alert('Produto adicionado com sucesso!');
                setDescription('');
                setQuantity(0);
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('Erro ao adicionar o produto!');
            });
    }

    return (
        <Container>
            <Input
                placeholder="Nome do produto"
                size="medium"
                onChangeText={setDescription}
                value={description}
            />

            <Input
                placeholder="0"
                keyboardType="numeric"
                size="small"
                style={{ marginHorizontal: 8 }}
                onChangeText={(value) => setQuantity(Number(value))}
                value={String(quantity)}
            />

            <ButtonIcon
                size='large'
                icon="add-shopping-cart"
                onPress={handleProductAdd}
            />
        </Container>
    );
}
