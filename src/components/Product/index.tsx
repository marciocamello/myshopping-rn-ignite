import firestore from '@react-native-firebase/firestore';
import React from 'react';
import { Alert } from 'react-native';
import { ButtonIcon } from '../ButtonIcon';
import { Container, Info, Options, Quantity, Title } from './styles';

export type ProductProps = {
    id: string;
    description: string;
    quantity: number;
    done: boolean;
}

type Props = {
    data: ProductProps;
}

export function Product({ data }: Props) {

    function handleDoneToggle() {
        firestore()
            .collection('products')
            .doc(data.id)
            .update({
                done: !data.done,
            });
    }

    function handleRemoveProduct() {
        Alert.alert(
            'Remover produto',
            'Tem certeza que deseja remover esse produto?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Remover',
                    onPress: () => {
                        firestore()
                            .collection('products')
                            .doc(data.id)
                            .delete();
                    }
                },
            ],
            { cancelable: false },
        );
    }

    return (
        <Container>
            <Info>
                <Title done={data.done}>
                    {data.description}
                </Title>

                <Quantity>
                    Quantidade: {data.quantity}
                </Quantity>
            </Info>

            <Options>
                <ButtonIcon
                    icon={data.done ? "undo" : "check"}
                    onPress={handleDoneToggle}
                />

                <ButtonIcon
                    icon="delete"
                    color="alert"
                    onPress={handleRemoveProduct}
                />
            </Options>
        </Container>
    );
}
