import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { authService } from '../services/authService'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types/navigation'

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
    const dispatch = useDispatch()
    const navigation = useNavigation<DashboardScreenNavigationProp>()

    const handleLogout = async () => {
        try {
            // Call the logout method from authService
            await authService.logout()

            // Dispatch the logout action to update Redux state
            dispatch(logout())

            // Navigate back to the login screen
            navigation.replace('Login')
        } catch (error) {
            console.error('Logout error:', error)
            // Even if there's an error with the API call, we still want to log out locally
            dispatch(logout())
            navigation.replace('Login')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <View style={styles.content}>
                <Text style={styles.welcomeText}>Welcome to TaskMaster Pro!</Text>
                <Text style={styles.instructionText}>Your tasks will appear here.</Text>
            </View>
            <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.logoutButton}
            >
                Logout
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 18,
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 16,
        color: '#666',
    },
    logoutButton: {
        marginBottom: 20,
        backgroundColor: '#e74c3c', // Red color for logout button
    }
})