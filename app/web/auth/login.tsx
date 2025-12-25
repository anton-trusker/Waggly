import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthHeroPanel from '@/components/desktop/auth/AuthHeroPanel';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        try {
            const remembered = typeof localStorage !== 'undefined' && localStorage.getItem('remember_me') === '1';
            setRememberMe(remembered);
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session && remembered) {
                    router.replace('/web/dashboard' as any);
                }
            }).catch(() => {});
        } catch {}
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) throw error;
            try {
                if (typeof localStorage !== 'undefined') {
                    if (rememberMe) {
                        localStorage.setItem('remember_me', '1');
                    } else {
                        localStorage.removeItem('remember_me');
                    }
                }
            } catch {}
            router.replace('/web/dashboard' as any);
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'apple') => {
        try {
            try {
                if (typeof localStorage !== 'undefined') {
                    if (rememberMe) {
                        localStorage.setItem('remember_me', '1');
                    } else {
                        localStorage.removeItem('remember_me');
                    }
                }
            } catch {}
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin + '/web/dashboard',
                },
            });
            if (error) throw error;
        } catch (error: any) {
            Alert.alert('OAuth Error', error.message);
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
                    <Text style={styles.heading}>Welcome back</Text>
                    <Text style={styles.subheading}>Manage your pet’s health and happiness.</Text>

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

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Password</Text>
                            <TouchableOpacity onPress={() => router.push('/web/auth/forgot' as any)}>
                                <Text style={styles.link}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoComplete="password"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Remember Me */}
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
                            </View>
                            <Text style={styles.checkboxLabel}>Remember me</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* OAuth Buttons */}
                    <TouchableOpacity
                        style={styles.oauthButton}
                        onPress={() => handleOAuthLogin('google')}
                    >
                        <Ionicons name="logo-google" size={20} color="#111827" />
                        <Text style={styles.oauthButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.oauthButton}
                        onPress={() => handleOAuthLogin('apple')}
                    >
                        <Ionicons name="logo-apple" size={20} color="#111827" />
                        <Text style={styles.oauthButtonText}>Continue with Apple</Text>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/web/auth/signup' as any)}>
                            <Text style={styles.footerLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Right: Hero Panel */}
            <View style={styles.heroSection}>
                <AuthHeroPanel
                    title="Your pet’s world, made simple and caring"
                    subtitle="Create a free account to keep health records in one place, find trusted services, and enjoy life with your furry friend."
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
    },
    inputGroup: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 0,
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
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    link: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '600',
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
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        fontSize: 14,
        color: '#6B7280',
        paddingHorizontal: 16,
    },
    oauthButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        marginBottom: 12,
    },
    oauthButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    footerLink: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '600',
    },
});
