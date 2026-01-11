import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';

interface CustomDatePickerProps {
    visible: boolean;
    date: Date;
    onClose: () => void;
    onConfirm: (date: Date) => void;
    title?: string;
}

export default function CustomDatePicker({ visible, date, onClose, onConfirm, title = "Date of Birth" }: CustomDatePickerProps) {
    const [tempDate, setTempDate] = React.useState(date);

    React.useEffect(() => {
        if (visible) {
            setTempDate(date);
        }
    }, [date, visible]);

    if (Platform.OS === 'android') {
        if (!visible) return null;
        return (
            <DateTimePicker
                value={tempDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                    if (event.type === 'set' && selectedDate) {
                        onConfirm(selectedDate);
                    } else {
                        onClose();
                    }
                }}
                maximumDate={new Date()}
            />
        );
    }

    // Web implementation using HTML5 date input
    if (Platform.OS === 'web') {
        if (!visible) return null;

        const formatDateForInput = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return (
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={onClose}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.container, { maxWidth: 400, alignSelf: 'center', marginTop: '20%' }] as any}
                    >
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onClose}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>{title}</Text>
                            <TouchableOpacity onPress={() => {
                                onConfirm(tempDate);
                                onClose();
                            }}>
                                <Text style={styles.confirmText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.pickerContainer, { padding: 24 }]}>
                            <input
                                type="date"
                                value={formatDateForInput(tempDate)}
                                onChange={(e) => {
                                    const newDate = new Date(e.target.value);
                                    if (!isNaN(newDate.getTime())) {
                                        setTempDate(newDate);
                                    }
                                }}
                                max={formatDateForInput(new Date())}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    fontSize: '16px',
                                    borderRadius: '12px',
                                    border: `1px solid ${designSystem.colors.neutral[200]}`,
                                    backgroundColor: '#fff',
                                    cursor: 'pointer',
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        );
    }

    // iOS implementation
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={() => onConfirm(tempDate)}>
                            <Text style={styles.confirmText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.pickerContainer}>
                        <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display="spinner"
                            onChange={(event, date) => {
                                if (date) setTempDate(date);
                            }}
                            maximumDate={new Date()}
                            textColor={designSystem.colors.text.primary}
                            themeVariant="light"
                            style={{ height: 200, width: '100%' }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: designSystem.colors.background.primary,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: designSystem.colors.neutral[100],
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[200],
    },
    title: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.text.primary,
    },
    cancelText: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.secondary,
    },
    confirmText: {
        ...designSystem.typography.title.small,
        color: designSystem.colors.primary[500],
        fontWeight: '700',
    },
    pickerContainer: {
        backgroundColor: designSystem.colors.background.primary,
        height: 250,
        justifyContent: 'center',
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
