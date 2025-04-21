import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

type Props = {
    navigation: SplashScreenNavigationProp;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Simulate splash screen delay and then navigate
        const timer = setTimeout(() => {
            // Navigate to Login or Dashboard based on authentication status
            if (token) {
                navigation.replace('Dashboard');
            } else {
                navigation.replace('Login');
            }
        }, 2000);

        // Clear timeout on unmount
        return () => clearTimeout(timer);
    }, [navigation, token]);

    return (
        <View style={styles.container}>
            {/* You'll need to add your actual logo in the assets folder */}
            {/* <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            /> */}
            <Text style={styles.title}>TaskMaster Pro</Text>
            <Text style={styles.subtitle}>Manage tasks efficiently</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3498db',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        opacity: 0.8,
    },
});

export default SplashScreen;