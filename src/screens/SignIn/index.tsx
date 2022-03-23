import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';

import { Container, Account, Title, Subtitle } from './styles';
import { ButtonText } from '../../components/ButtonText';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Alert } from 'react-native';

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSignInAnonymous() {
        try {
            const { user } = await auth().signInAnonymously();
            console.log(user);
        } catch (error) {
            console.log(error);
        }
    }

    function handleCreateUserAccount() {
        if (email && password) {
            auth().createUserWithEmailAndPassword(
                email,
                password
            )
                .then(() => {
                    Alert.alert('Conta criada com sucesso!');
                })
                .catch(error => {
                    console.log(error.code);

                    if (error.code === 'auth/email-already-in-use') {
                        Alert.alert('Este e-mail já está em uso!');
                    } else if (error.code === 'auth/invalid-email') {
                        Alert.alert('E-mail inválido!');
                    } else if (error.code === 'auth/weak-password') {
                        Alert.alert('Senha deve ter no mínimo 6 caracteres!');
                    }
                });
        } else {
            Alert.alert('Erro', 'Preencha todos os campos');
        }
    }

    function handleSignInEmailAndPassword() {
        if (email && password) {
            auth().signInWithEmailAndPassword(
                email,
                password
            )
                .then(({ user }) => {
                    console.log(user);
                })
                .catch(error => {
                    console.log(error.code);

                    if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
                        Alert.alert('E-mail ou senha inválidos!');
                    } else {
                        Alert.alert('Erro ao realizar login!');
                    }
                });
        } else {
            Alert.alert('Erro', 'Preencha todos os campos');
        }
    }

    function handleForgotPassword() {
        if (email) {
            auth().sendPasswordResetEmail(email)
                .then(() => {
                    Alert.alert('Enviamos um e-mail para você para redefinir sua senha!');
                })
                .catch(error => {
                    console.log(error.code);

                    if (error.code === 'auth/invalid-email') {
                        Alert.alert('E-mail inválido!');
                    } else {
                        Alert.alert('Erro ao enviar e-mail!');
                    }
                });
        } else {
            Alert.alert('Preencha o campo de email');
        }
    }

    return (
        <Container>
            <Title>MyShopping</Title>
            <Subtitle>monte sua lista de compra te ajudar nas compras</Subtitle>

            <Input
                placeholder="e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
            />

            <Input
                placeholder="senha"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
            />

            <Button title="Entrar" onPress={handleSignInEmailAndPassword} />

            <Account>
                <ButtonText title="Recuperar senha" onPress={handleForgotPassword} />
                <ButtonText title="Criar minha conta" onPress={handleCreateUserAccount} />
            </Account>
        </Container>
    );
}