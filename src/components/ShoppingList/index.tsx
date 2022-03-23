import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Product, ProductProps } from '../Product';
import { styles } from './styles';

export function ShoppingList() {
    const [products, setProducts] = useState<ProductProps[]>([]);

    useFocusEffect(() => {
        const subscribe = firestore()
            .collection('products')
            .orderBy('description')
            .onSnapshot((querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    };
                }) as ProductProps[];

                setProducts(data);
            });

        return () => subscribe();
    });

    return (
        <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <Product data={item} />}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            contentContainerStyle={styles.content}
        />
    );
}
