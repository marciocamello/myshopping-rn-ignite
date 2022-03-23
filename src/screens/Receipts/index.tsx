import React, { useState } from 'react';
import { Alert, FlatList } from 'react-native';
import storage from '@react-native-firebase/storage';

import { Container, PhotoInfo } from './styles';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';
import { File, FileProps } from '../../components/File';
import { useFocusEffect } from '@react-navigation/native';

export function Receipts() {
    const [photos, setPhotos] = useState<FileProps[]>([]);
    const [photoSelected, setPhotoSelected] = useState('');
    const [photoInfo, setPhotoInfo] = useState('');

    async function fetchImages() {
        storage()

            .ref('images')
            .listAll()
            .then(res => {
                const files: FileProps[] = [];

                res.items.forEach(file => {
                    files.push({
                        name: file.name,
                        path: file.fullPath,
                    });
                });

                setPhotos(files);
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    useFocusEffect(() => {
        fetchImages();
    });

    async function handleShowImage(path: string) {
        const imageRef = await storage().ref(path).getDownloadURL();
        setPhotoSelected(imageRef);

        const info = await storage().ref(path).getMetadata();
        const dateInfo = new Date(info.timeCreated).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        setPhotoInfo(`Upload realizado em ${dateInfo}`);
    }

    async function handleDeleteImage(path: string) {
        Alert.alert('Atenção', 'Deseja realmente excluir a imagem?', [
            {
                text: 'Não',
                style: 'cancel',
            },
            {
                text: 'Sim',
                onPress: async () => {
                    await storage()
                        .ref(path)
                        .delete()
                        .then(() => {

                            const photosFiltered = photos.filter(photo => photo.path !== path);
                            setPhotos(photosFiltered);
                            setPhotoSelected('');
                            setPhotoInfo('');
                            fetchImages();
                        })
                        .catch(err => {
                            console.log(err.message);
                        });
                },
            },
        ]);
    }

    return (
        <Container>
            <Header title="Comprovantes" />

            <Photo uri={photoSelected} />

            <PhotoInfo>
                {photoInfo}
            </PhotoInfo>

            <FlatList
                data={photos}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <File
                        data={item}
                        onShow={() => handleShowImage(item.path)}
                        onDelete={() => handleDeleteImage(item.path)}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                style={{ width: '100%', padding: 24 }}
            />
        </Container>
    );
}
