import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './app.routes';
import { SignIn } from '../screens/SignIn';

type User = {
    uid: string;
}

export function Routes() {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(user => {
            setUser(user);
        });

        return subscriber;
    }, []);

    return (
        <NavigationContainer>
            {user ? <AppRoutes /> : <SignIn />}
        </NavigationContainer>
    )
}