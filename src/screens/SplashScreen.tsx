import React, { useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { authService } from '../services/authService';
import { login } from '../store/slices/authSlice';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

type Props = {
    navigation: SplashScreenNavigationProp;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = React.useState(true);

    // Check for stored credentials when component mounts
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to load stored credentials from AsyncStorage
                const credentials = await authService.loadStoredCredentials();

                if (credentials) {
                    // If credentials exist, update Redux state
                    dispatch(login(credentials));
                    // Navigate to Dashboard
                    navigation.replace('Dashboard');
                } else {
                    // If no credentials, show the splash screen with button
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [dispatch, navigation]);

    const handleStart = () => {
        navigation.replace('Login');
    };

    // Show loading indicator while checking credentials
    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#6C3CE9" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('./../../assets/pana.png')}
                    style={styles.illustration}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.title}>TaskMasterPro</Text>
            <Text style={styles.subtitle}>Manage your Project</Text>

            <TouchableOpacity
                style={styles.startButton}
                onPress={handleStart}
            >
                <Text style={styles.buttonText}>Let's Start</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    illustration: {
        width: '90%',
        height: 300,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#6C3CE9',
        fontFamily: 'System',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 36,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 50,
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#6C3CE9',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default SplashScreen;