import React, { useState } from 'react';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';

import { Container, Content, Progress, Transferred } from './styles';
import { Alert } from 'react-native';

export function Upload() {
    const [image, setImage] = useState('');
    const [bytesTransferred, setBytesTransferred] = useState('');
    const [progress, setProgress] = useState('0');

    async function handlePickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status == 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 4],
                quality: 1,
            });

            if (!result.cancelled) {
                setImage(result.uri);
            }
        }
    };

    async function handleUpload() {
        const fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const fileExtension = image.split('.').pop();
        const fileRef = storage().ref(`images/${fileName}.${fileExtension}`);

        const uploadTask = fileRef.putFile(image);

        uploadTask.on('state_changed', snapshot => {
            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            setProgress(percent);
            setBytesTransferred(`${snapshot.bytesTransferred} transferido de ${snapshot.totalBytes}`);
        }, error => {
            console.log(error.message);
        }, async () => {
            const imageUrl = await fileRef.getDownloadURL();
            // save this url to the database
            Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
        });
    }

    return (
        <Container>
            <Header title="Upload de Fotos" />

            <Content>
                <Photo uri={image} onPress={handlePickImage} />

                <Button
                    title="Fazer upload"
                    onPress={handleUpload}
                />

                <Progress>
                    {progress}%
                </Progress>

                <Transferred>
                    {bytesTransferred}
                </Transferred>
            </Content>
        </Container>
    );
}
