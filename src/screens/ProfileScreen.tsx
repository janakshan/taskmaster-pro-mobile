import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { logout } from '../store/slices/authSlice';
import { authService } from '../services/authService';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Handle navigation back
    const handleGoBack = () => {
        navigation.goBack();
    };

    // Handle logout with proper error handling
    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            // Call the logout method from authService
            await authService.logout();

            // Dispatch the logout action to update Redux state
            dispatch(logout());

            // Navigate to Login screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert(
                'Logout Error',
                'There was a problem logging out. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Confirm logout with alert
    const confirmLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: handleLogout, style: 'destructive' }
            ]
        );
    };

    // Handle edit profile
    const handleEditProfile = () => {
        // Navigate to edit profile screen or open modal
        console.log('Edit profile');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#6c5ce7" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={styles.placeholderRight} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileImageContainer}>
                    <View style={styles.avatarOuterRing}>
                        <View style={styles.avatarInnerContainer}>
                            <Image
                                source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
                                style={styles.profileImage}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.editAvatarButton}>
                        <Icon name="plus" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Profile Info Fields */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Icon name="user" size={20} color="#333" />
                        </View>
                        <Text style={styles.infoText}>{user?.name || 'Fazil Laghari'}</Text>
                        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
                            <Icon name="edit-2" size={20} color="#6c5ce7" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Icon name="mail" size={20} color="#333" />
                        </View>
                        <Text style={styles.infoText}>{user?.email || 'fazzzil72@gmail.com'}</Text>
                        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
                            <Icon name="edit-2" size={20} color="#6c5ce7" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Icon name="lock" size={20} color="#333" />
                        </View>
                        <Text style={styles.infoText}>Password</Text>
                        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
                            <Icon name="edit-2" size={20} color="#6c5ce7" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Icon name="check-square" size={20} color="#333" />
                        </View>
                        <Text style={styles.infoText}>My Tasks</Text>
                        <Icon name="chevron-down" size={20} color="#333" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Icon name="credit-card" size={20} color="#333" />
                        </View>
                        <Text style={styles.infoText}>Privacy</Text>
                        <Icon name="chevron-down" size={20} color="#333" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Icon name="settings" size={20} color="#333" />
                        </View>
                        <Text style={styles.infoText}>Setting</Text>
                        <Icon name="chevron-down" size={20} color="#333" style={styles.arrowIcon} />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={confirmLogout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text style={styles.logoutText}>Logout</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6c5ce7',
    },
    placeholderRight: {
        width: 30,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        position: 'relative',
    },
    avatarOuterRing: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 2,
        borderColor: '#FFD700', // Gold color
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInnerContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#d4f5d7', // Light green background
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 5,
        right: 120,
        backgroundColor: '#333',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoSection: {
        paddingHorizontal: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: '#eaeaea',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: 'white',
        paddingHorizontal: 15,
    },
    iconContainer: {
        marginRight: 15,
    },
    infoText: {
        fontSize: 18,
        color: '#333',
        flex: 1,
    },
    editButton: {
        padding: 5,
    },
    arrowIcon: {
        marginLeft: 10,
    },
    logoutButton: {
        backgroundColor: '#6c5ce7',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        minHeight: 54, // Add minimum height for better UX when showing loader
    },
    logoutText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;