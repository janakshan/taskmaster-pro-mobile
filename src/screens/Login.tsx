import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, Checkbox } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { API_URL, ERROR_MESSAGES } from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
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

        // Check for saved credentials
        const loadSavedCredentials = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('savedEmail');
                const savedPassword = await AsyncStorage.getItem('savedPassword');

                if (savedEmail && savedPassword) {
                    setEmail(savedEmail);
                    setPassword(savedPassword);
                    setRememberMe(true);
                }
            } catch (error) {
                console.error('Error loading saved credentials:', error);
            }
        };

        loadSavedCredentials();
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

            // Save credentials if remember me is checked
            if (rememberMe) {
                await AsyncStorage.setItem('savedEmail', email);
                await AsyncStorage.setItem('savedPassword', password);
            } else {
                // Clear saved credentials if remember me is unchecked
                await AsyncStorage.removeItem('savedEmail');
                await AsyncStorage.removeItem('savedPassword');
            }

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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.container}>
                <Text style={styles.titleText}>Login</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            mode="flat"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                            placeholder="Email address"
                            underlineColor="transparent"
                            left={<TextInput.Icon icon="account" color="#666" />}
                        />
                    </View>

                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            mode="flat"
                            secureTextEntry={!passwordVisible}
                            style={styles.input}
                            placeholder="Password"
                            underlineColor="transparent"
                            left={<TextInput.Icon icon="lock" color="#666" />}
                            right={
                                <TextInput.Icon
                                    icon={passwordVisible ? "eye-off" : "eye"}
                                    color="#666"
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                />
                            }
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <View style={styles.rememberForgotContainer}>
                        <View style={styles.rememberMeContainer}>
                            <Checkbox
                                status={rememberMe ? 'checked' : 'unchecked'}
                                onPress={() => setRememberMe(!rememberMe)}
                                color="#6039FF"
                            />
                            <Text style={styles.rememberMeText}>Remember me</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.loginButton}
                        labelStyle={styles.loginButtonText}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : 'Log In'}
                    </Button>

                    <View style={styles.registerContainer}>
                        <Text style={styles.noAccountText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 80,
        backgroundColor: '#fff',
    },
    titleText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#6039FF',
        marginTop: 0, // Reduced from 40 to give proper spacing after SafeAreaView
        marginBottom: 30,
    },
    formContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    inputContainer: {
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    input: {
        backgroundColor: 'transparent',
        height: 56,
    },
    rememberForgotContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberMeText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#333',
    },
    forgotPasswordText: {
        color: '#6039FF',
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#6039FF',
        height: 56,
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 24,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#e74c3c',
        marginBottom: 10,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    noAccountText: {
        fontSize: 16,
        color: '#333',
    },
    signUpText: {
        fontSize: 16,
        color: '#6039FF',
        fontWeight: 'bold',
    },
});

export default LoginScreen;