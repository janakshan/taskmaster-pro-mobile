import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, Checkbox } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { ERROR_MESSAGES } from '../config';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
    navigation: RegisterScreenNavigationProp;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const dispatch = useDispatch();

    const validateInputs = () => {
        // Reset error
        setError('');

        // Basic validation
        if (!name.trim()) {
            setError('Full name is required');
            return false;
        }

        if (!email.trim()) {
            setError('Email address is required');
            return false;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!password.trim()) {
            setError('Password is required');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (!agreedToTerms) {
            setError('You must agree to the terms and conditions');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateInputs()) {
            return;
        }

        try {
            setLoading(true);

            // Call the authService to register
            const userData = await authService.register(name, email, password);

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
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.titleText}>Signup</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            mode="flat"
                            autoCapitalize="words"
                            style={styles.input}
                            placeholder="Enter your full name"
                            underlineColor="transparent"
                            left={<TextInput.Icon icon="account" color="#666" />}
                        />
                    </View>

                    <Text style={styles.inputLabel}>Email Address</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            mode="flat"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                            placeholder="Enter your email"
                            underlineColor="transparent"
                            left={<TextInput.Icon icon="email" color="#666" />}
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
                            placeholder="Enter your password"
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

                    <View style={styles.termsContainer}>
                        <Checkbox
                            status={agreedToTerms ? 'checked' : 'unchecked'}
                            onPress={() => setAgreedToTerms(!agreedToTerms)}
                            color="#6039FF"
                        />
                        <Text style={styles.termsText}>
                            I have read & agreed to TaskMaster Pro{' '}
                            <Text style={styles.linkText} onPress={() => {/* Open privacy policy */ }}>
                                Privacy Policy
                            </Text>,{' '}
                            <Text style={styles.linkText} onPress={() => {/* Open terms */ }}>
                                Terms & Condition
                            </Text>
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleRegister}
                        style={styles.registerButton}
                        labelStyle={styles.registerButtonText}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : 'Sign Up'}
                    </Button>

                    <View style={styles.loginContainer}>
                        <Text style={styles.haveAccountText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 20,
        paddingTop: 80, // Reduced from 40 to give proper spacing after SafeAreaView
    },
    titleText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#6039FF',
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    termsText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    linkText: {
        color: '#6039FF',
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#6039FF',
        height: 56,
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 24,
    },
    registerButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#e74c3c',
        marginBottom: 10,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    haveAccountText: {
        fontSize: 16,
        color: '#333',
    },
    loginText: {
        fontSize: 16,
        color: '#6039FF',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;