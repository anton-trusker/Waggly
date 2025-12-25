import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthHeroPanel from '@/components/desktop/auth/AuthHeroPanel';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: window.location.origin + '/web/auth/reset-password',
            });

            if (error) throw error;

            setEmailSent(true);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Left: Form */}
            <View style={styles.formSection}>
                {/* Logo header */}
                <View style={styles.logoHeader}>
                    <Image source={{ uri: '/logo.png' }} style={styles.logoImage} />
                    <Text style={styles.logoText}>pawzly</Text>
                </View>
                <View style={styles.formContainer}>
                    {!emailSent ? (
                        <>
                            <Text style={styles.heading}>Forgot Password?</Text>
                            <Text style={styles.subheading}>
                                Enter your email address and we'll send you a link to reset your password
                            </Text>

                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="your@email.com"
                                        placeholderTextColor="#9CA3AF"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                    />
                                </View>
                            </View>

                            {/* Send Reset Link Button */}
                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleResetPassword}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Send Reset Link</Text>
                                )}
                            </TouchableOpacity>

                            {/* Back to Login Link */}
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.push('/web/auth/login' as any)}
                            >
                                <Ionicons name="arrow-back" size={20} color="#6366F1" />
                                <Text style={styles.backText}>Back to Login</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={styles.successContainer}>
                            <View style={styles.successIcon}>
                                <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                            </View>
                            <Text style={styles.successHeading}>Check Your Email</Text>
                            <Text style={styles.successText}>
                                We've sent a password reset link to <Text style={styles.emailText}>{email}</Text>
                            </Text>
                            <Text style={styles.successSubtext}>
                                Check your inbox and follow the instructions to reset your password
                            </Text>

                            {/* Back to Login Button */}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => router.push('/web/auth/login' as any)}
                            >
                                <Text style={styles.buttonText}>Back to Login</Text>
                            </TouchableOpacity>

                            {/* Resend Link */}
                            <TouchableOpacity
                                style={styles.resendButton}
                                onPress={() => setEmailSent(false)}
                            >
                                <Text style={styles.resendText}>Didn't receive email? <Text style={styles.link}>Resend</Text></Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* Right: Hero Panel */}
            <View style={styles.heroSection}>
                <AuthHeroPanel
                    title="Reset Your Password"
                    subtitle="We'll send you instructions to reset your password"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    heroSection: {
        flex: 1,
    },
    formSection: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
    },
    logoHeader: {
        position: 'absolute',
        top: 24,
        left: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoImage: {
        width: 32,
        height: 32,
    },
    logoText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        textTransform: 'lowercase',
    },
    formContainer: {
        width: '100%',
        maxWidth: 440,
    },
    heading: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
        lineHeight: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
        backgroundColor: '#F9FAFB',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    button: {
        backgroundColor: '#6366F1',
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    backText: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '600',
    },
    successContainer: {
        alignItems: 'center',
    },
    successIcon: {
        marginBottom: 24,
    },
    successHeading: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    successText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 24,
    },
    emailText: {
        fontWeight: '600',
        color: '#111827',
    },
    successSubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 32,
    },
    resendButton: {
        marginTop: 16,
    },
    resendText: {
        fontSize: 14,
        color: '#6B7280',
    },
    link: {
        color: '#6366F1',
        fontWeight: '600',
    },
});
