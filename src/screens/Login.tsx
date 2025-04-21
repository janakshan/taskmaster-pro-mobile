import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { API_URL, ERROR_MESSAGES } from '../config';
import axios from 'axios';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};



const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const testConnection = async () => {
            try {
                console.log('Testing API connection...');
                // Note the URL doesn't include /api for health check
                const response = await axios.get(`http://192.168.1.140:5000/health`);
                console.log('API connection successful:', response.data);
            } catch (error) {
                console.error('API connection failed:', error);
            }
        };
        testConnection();
    }, []);

    const handleLogin = async () => {
        // Basic validation
        if (!email.trim() || !password.trim()) {
            setError('Email and password are required');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Call the authService to login
            const userData = await authService.login(email, password);

            // Store the auth data in Redux
            dispatch(login(userData));

            // Navigate to the main dashboard
            navigation.replace('Dashboard');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(ERROR_MESSAGES.AUTHENTICATION_FAILED);
            }
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                /> */}
                <Text style={styles.logoText}>TaskMaster Pro</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                />

                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : 'Sign In'}
                </Button>

                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={styles.forgotPassword}
                >
                    <Text>Forgot password?</Text>
                </TouchableOpacity>

                {/* <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </View> */}



                <View style={styles.registerContainer}>
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.registerText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    logo: {
        width: 80,
        height: 80,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#3498db',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
    },
    errorText: {
        color: '#e74c3c',
        marginBottom: 10,
    },
    forgotPassword: {
        alignSelf: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#999',
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    socialButton: {
        flex: 1,
        marginHorizontal: 5,
    },
    googleButton: {
        borderColor: '#4285F4',
    },
    githubButton: {
        borderColor: '#333',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        color: '#3498db',
        fontWeight: 'bold',
    },
});

export default LoginScreen;