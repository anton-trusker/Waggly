import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button } from '@/components/design-system/primitives/Button';
import { Input } from '@/components/design-system/primitives/Input';
import { MeasurementWidget } from '@/components/design-system/widgets/MeasurementWidget';
import { AddressWidget } from '@/components/design-system/widgets/AddressWidget';
import { MoneyWidget } from '@/components/design-system/widgets/MoneyWidget';
import { Select } from '@/components/design-system/primitives/Select';
import { DatePicker } from '@/components/design-system/primitives/DatePicker';
import { PetCard } from '@/components/design-system/widgets/PetCard';

// --- Placeholder Components (will import these later) ---
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>{children}</View>
    </View>
);

const ComponentBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.block}>
        <Text style={styles.blockTitle}>{title}</Text>
        <View style={styles.blockContent}>{children}</View>
    </View>
);

export default function DesignSystemGallery() {
    const [activeTab, setActiveTab] = useState<'primitives' | 'inputs' | 'widgets'>('primitives');

    const tabs = [
        { id: 'primitives', label: 'Primitives' },
        { id: 'inputs', label: 'Form Inputs' },
        { id: 'widgets', label: 'Smart Widgets' },
    ] as const;

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Design System', headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🎨 Design System</Text>
                <Text style={styles.headerSubtitle}>Waggly Component Library v1.0</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {activeTab === 'primitives' && (
                    <View>
                        <Section title="Standard Inputs">
                            <ComponentBlock title="Text Inputs">
                                <Input label="Email Address" placeholder="hello@example.com" />
                                <Input label="Password" secureTextEntry placeholder="••••••••" />
                                <Input label="With Icon" leftIcon="mail" placeholder="Icon input" />
                                <Input label="Error State" error="This field is required" value="Invalid input" />
                            </ComponentBlock>
                        </Section>

                        <Section title="Buttons">
                            <ComponentBlock title="Variants">
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                                    <Button title="Primary" onPress={() => { }} />
                                    <Button title="Secondary" variant="secondary" onPress={() => { }} />
                                    <Button title="Outline" variant="outline" onPress={() => { }} />
                                    <Button title="Ghost" variant="ghost" onPress={() => { }} />
                                    <Button title="Loading" loading onPress={() => { }} />
                                </View>
                            </ComponentBlock>
                        </Section>

                        <Section title="Colors">
                            <ComponentBlock title="Primary Palette">
                                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                                    {[500, 600, 700].map(shade => (
                                        <View key={shade} style={{ width: 60, height: 60, backgroundColor: (designSystem.colors.primary as any)[shade], borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontSize: 10 }}>{shade}</Text>
                                        </View>
                                    ))}
                                </View>
                            </ComponentBlock>
                        </Section>
                    </View>
                )}

                {activeTab === 'inputs' && (
                    <View>
                        <Section title="Standard Inputs">
                            <Input label="Simple Input" placeholder="Type here..." />
                        </Section>

                        <Section title="Selection Controls">
                            <ComponentBlock title="Select">
                                <Select
                                    label="Pet Gender"
                                    options={[
                                        { label: 'Male', value: 'male' },
                                        { label: 'Female', value: 'female' },
                                    ]}
                                />
                            </ComponentBlock>

                            <ComponentBlock title="Date Picker">
                                <DatePicker label="Date of Birth" />
                            </ComponentBlock>
                        </Section>
                    </View>
                )}
                {activeTab === 'widgets' && (
                    <View>
                        <Section title="Smart Widgets">
                            <ComponentBlock title="Address Widget">
                                <AddressWidget
                                    label="Home Address"
                                    onChange={(addr) => console.log(addr)}
                                />
                            </ComponentBlock>

                            <ComponentBlock title="Money Widget">
                                <MoneyWidget
                                    label="Cost"
                                    value={{ amount: 49.99, currency: 'USD' }}
                                />
                            </ComponentBlock>

                            <ComponentBlock title="Pet Cards">
                                <View style={{ gap: 12 }}>
                                    <Text style={{ fontSize: 12, color: '#666' }}>Detailed</Text>
                                    <PetCard
                                        pet={{
                                            id: '1',
                                            name: 'Cooper',
                                            breed: 'Golden Retriever',
                                            date_of_birth: '2020-01-01',
                                            gender: 'male',
                                            weight: 32,
                                            image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        }}
                                        variant="detailed"
                                    />

                                    <Text style={{ fontSize: 12, color: '#666' }}>Minimal</Text>
                                    <PetCard
                                        pet={{ id: '2', name: 'Bella', breed: 'Poodle', image_url: null }}
                                        variant="minimal"
                                    />

                                    <Text style={{ fontSize: 12, color: '#666' }}>Compact (Grid)</Text>
                                    <View style={{ flexDirection: 'row', gap: 12 }}>
                                        <PetCard
                                            pet={{ id: '3', name: 'Luna', breed: 'Husky' }}
                                            variant="compact"
                                        />
                                        <PetCard
                                            pet={{ id: '4', name: 'Max', breed: 'Beagle' }}
                                            variant="compact"
                                        />
                                    </View>
                                </View>
                            </ComponentBlock>

                            <ComponentBlock title="Measurement Widget">
                                <MeasurementWidget
                                    type="weight"
                                    label="Pet Weight"
                                    defaultUnitSystem="metric"
                                    value={{ value: 10.5, unit: 'kg' }}
                                />
                                <MeasurementWidget
                                    type="height"
                                    label="Pet Height"
                                    defaultUnitSystem="imperial"
                                    value={{ value: 24, unit: 'in' }}
                                />
                            </ComponentBlock>
                        </Section>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.primary,
    },
    header: {
        padding: 24,
        paddingTop: Platform.OS === 'android' ? 48 : 24,
        backgroundColor: designSystem.colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    headerTitle: {
        ...designSystem.typography.title.large,
        marginBottom: 4,
    },
    headerSubtitle: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.secondary,
    },
    tabs: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: designSystem.colors.neutral[100],
    },
    activeTab: {
        backgroundColor: designSystem.colors.primary[500],
    },
    tabText: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.text.secondary,
    },
    activeTabText: {
        color: 'white',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        ...designSystem.typography.title.medium,
        marginBottom: 16,
        color: designSystem.colors.text.primary,
    },
    sectionContent: {
        gap: 16,
    },
    block: {
        backgroundColor: designSystem.colors.background.secondary, // Light grey background for blocks
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
    },
    blockTitle: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.tertiary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    blockContent: {
        gap: 8,
    },
    placeholderText: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.tertiary,
        fontStyle: 'italic',
    },
});
